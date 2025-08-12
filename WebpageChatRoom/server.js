const http = require("http");
const fs = require("fs");

const host = '127.0.0.1';
const port = 8080;
let count = 0;
//let convo = [ {id:123, text:"hi"}, {id:456, text:"howdie"}, ...];
//let convo2 = [];
let convo = [];
//let arrID = [];
const some_mime_types = {
    '.html': 'text/html',
    '.ico': 'image/png',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
}

const parseISOString = (s) => {
  let b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
// function sendRequest() {
//   const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//   // 1. Create a new XMLHttpRequest object
//   const xhr = new XMLHttpRequest();

//   // 2. Configure the request (method, URL, asynchronous)
//   xhr.open("GET", "http://127.0.0.1:8080", true);
//   console.log("After open");
//   // 3. Set up a callback function to handle the response
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       // Process the response data
//       const response = JSON.parse(xhr.responseText);
//       console.log(response);
//     } else {
//       console.error("Request failed with status:", xhr.status);
//     }
//   };
//   console.log(`Message received: ${response}`);
//   // 4. Send the request
//   xhr.send();
// }

// function listenForHTTPRequest() {
  
//   const server = http.createServer((req, res) =>{
//     if (req.method === 'POST' && req.url === 'http://127.0.0.1') {
//       res.writeHead(200, {'Content-Type': 'application/json'})
//       res.end(JSON.stringify({message: 'Hello from the server!'}))
//     } else {
//       res.writeHead(404)
//       res.end('Not Found')
//     }
//   })

//   // server.listen(8000, () => {
//   //   console.log('Server listening on port 8000')
//   // })
// }


// function loadID() {
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//           document.getElementById("ID").innerHTML =
//           this.responseText;
//      }
//   };
//   xhttp.open("GET", "http://127.0.0.1:8080", true);
//   xhttp.send();
// }
// function loadMessage() {
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//           document.getElementById("message").innerHTML =
//           this.responseText;
//      }
//   };
//   xhttp.open("GET", "http://127.0.0.1:8080", true);
//   xhttp.send();
// }

// async function getID() {
//   const url = "http://127.0.0.1:8080";
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = await response.json();
//     console.log(json);
//   } catch (error) {
//     console.error(error.message);
//   }
// }
const requestListener = (request, response) => {

    // listenForHTTPRequest();
    // getID();
    //loadMessage();
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      console.log(`Got a request for ${request.url}, body=${body}`);
      let filename = request.url.substring(1); // cut off the '/'
      if (filename.length === 0)
        filename = 'client.html';
      const last_dot = filename.lastIndexOf('.');
      const extension = last_dot >= 0 ? filename.substring(last_dot) : '';
      if (filename === 'generated.html') {
          response.setHeader("Content-Type", "text/html");
          response.writeHead(200);
          response.end(`<html><body><h1>Random number: ${Math.random()}</h1></body></html>`);
      } 
      else if(filename === 'ajax'){
        let payload = JSON.parse(body);


        // console.log(`the payload is ${JSON.stringify(payload)}`);
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200);
        let ret;
        //response.end(`{"push_count":${count}}`);
        if(payload.action === 'chat')
        {
          // console.log('in chat');
          convo.push({
              action: payload.action,
              text_id: payload.text_id,
              text: payload.text,
              messageID: payload.messageID,
              timestamp: new Date().toISOString(),
              posted: payload.posted
          });
          //ret = {status: 'ok'};
          ret = payload;
          // console.log(`ret inside chat is`);
          // console.log(ret);
          //new Date().toISOString()
          //timestamp: parseISOString(payload.timestamp),
          //document.getElementById("demo").innerHTML = convo.toString();
          // console.log(`convo=${JSON.stringify(convo)}`);
          // console.log(convo);
        }
        else if(payload.action === 'update')
        {
          //from gashler
          ret = {chats: convo.slice(payload.pos) }
          // console.log(`Ret = `);
          // console.log(ret);


          // console.log(`update inside server`);
          // for (let i = 0; i < convo.length; i++)
          // {
          //   //message from another user
          //   console.log(`update if statement server`);
          //   if(payload.text_id !== convo[i].text_id && convo[i].posted === false)
          //   {
              

          //     convo[i].posted = true;
            
          //     console.log(`Message from Other User:`);
          //     console.log(convo[i]);

              
              
          //   }
          // }

          // console.log(`update after server`);
          // response.end(JSON.stringify(convo));
        }
          //from gashler
          response.end(JSON.stringify(ret))
      }
      else if (extension in some_mime_types && fs.existsSync(filename)) {
          fs.readFile(filename, null, (err, data) => {
              response.setHeader("Content-Type", some_mime_types[extension]);
              response.writeHead(200);
              response.end(data);
          });
      } else {
          response.setHeader("Content-Type", "text/html");
          response.writeHead(404);
          response.end(`<html><body><h1>404 - Not found</h1><p>There is no file named "${filename}".</body></html>`);
      }
      // console.log('leaving request handler');
    });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    
});