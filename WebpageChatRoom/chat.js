const g_id = Math.floor(Math.random() * 10000000);
let g_messages = [];
let id;
function scrub(text) {
	if (!text) {
		text = '';
	}
	text = text.replace(/&/g, '&amp;');
	text = text.replace(/>/g, '&gt;');
	text = text.replace(/</g, '&lt;');
	text = text.replace(/\n/g, '<br>');
	text = text.replace(/  /g, ' &nbsp;');
	return text;
}

function postHttp(payload, callback)
{
    const body = JSON.stringify(payload);
    fetch('ajax', {
        body: body,
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
    })
    .then(response => response.text())
    .then(text => {
        console.log(`The server replied ${text}`);
        let response_ob = JSON.parse(text);
        // console.log(`Response_ob is`);
        // console.log(response_ob);

        for(let i = 0; i < response_ob.chats.length; i++)
        {
            
            //console.log('got here');
            g_messages.push(response_ob.chats[i]);
            // console.log(`messages are :`);
            // console.log(g_messages);
            //update_messages(response_ob.chats[i].messageID, response_ob.chats[i].timestamp);
            if(response_ob.chats[i].text_id !== g_id)
            {
                post_message(false, response_ob.chats[i].timestamp, response_ob.chats[i].messageID, response_ob.chats[i].text);
                //update_messages(response_ob.chats[i].messageID, response_ob.chats[i].timestamp, response_ob.chats[i].text);

            }
            else
            {
                update_messages(response_ob.chats[i].messageID, response_ob.chats[i].timestamp);

                //post_message(true, response_ob.chats[i].timestamp, response_ob.chats[i].messageID, response_ob.chats[i].text);

            }
        }
        
        
        
    })

    .then(val => {
        return JSON.parse(val);
    })
    .then(ob => callback(ob));
    // .catch(ex => {
    //     console.log(`An error occurred in callHTTP: ${ex}\n${ex.trace}`);
    //     console.trace();
    // });
}
function update_board()
{   
    // console.log(`inside update_board`);

    payload = {
        action: 'update',
        text_id: g_id,
        pos: g_messages.length        
    }
    postHttp(payload, send_callback);
    // console.log(`after update_board`);
    //update_messages();
}


function send_callback(response){


}
function update_messages(messageID, timestamp)
{
    let message = document.getElementById(`id${messageID}`);
    message.querySelector('.date_stamp').innerHTML = timestamp;
    // const time = message.querySelector('.date_stamp');
    // //document.querySelector("#demo").innerHTML = "Hello World!";
    // time.innerHTML() = `<span class="date_stamp">${timestamp}</span>
    //                              <br>
    //                              <code>${text}</code>
    //                              </span>`;
    // const texts = message.querySelector('.date_stamp');
    // for(let i = 0; i < g_messages.length; i++)
    // {
    //     console.log(`inside update messages`);
    //     if(messageID === g_messages[i].messageID)
    //     {
    //         g_messages[i].timestamp = timestamp;
    //         let timer = document.querySelector('date_stamp');
    //         timer.innerHTML = `<span class="date_stamp">${timestamp}</span>
    //                             <br>
    //                             <code>${text}</code>
    //                             </span>`;

    //                             // s.push(`<span class="date_stamp">${timestamp}</span>`);
    //                             // s.push(`<br>`);
    //                             // s.push(`<code>${text}</code>`);
    //                             // s.push(`</span>`);
    //     }
    // }
    
}

//function post_message(is_me, timestamp, messageID, text)
function post_message(is_me, timestamp, messageID, text) {
    timestamp = scrub(timestamp);
    text = scrub(text);
    let chats_table = document.getElementById('chats');
    let new_row = chats_table.insertRow();
    let cell = new_row.insertCell(0);
    let s = [];




    s.push('<div class="');
    s.push(is_me ? 'bubble_right' : 'bubble_left');
    s.push('">');
    s.push(`<span class="date_stamp">${timestamp}</span>`);
    s.push(`<br>`);
    s.push(`<code>${text}</code>`);
    s.push(`</span>`);
    cell.id = `id${messageID}`; 
    cell.innerHTML = s.join('');


    cell.scrollIntoView({behavior:'smooth'});
}

function on_post_message() {
    let text_area = document.getElementById('chat_text');
    //let timestamp = new Date().toISOString();
    let timestamp = '';

    let messageID = Math.floor(Math.random() * 10000000);
    // console.log(`Reached onPostMessage`);
    post_message(true, timestamp, messageID, text_area.value);
    
    payload = {
        action: 'chat',
        text_id: g_id,
        text: text_area.value,
        messageID: messageID,
        timestamp: null,
        posted: false
        
    }
    postHttp(payload, send_callback);
    //update_board();
    text_area.value = '';
    auto_grow_text_area(text_area);
    text_area.focus();
    // console.log(`After onPostMessage`);

}

function auto_grow_text_area(el) {
	el.style.height = "5px";
    el.style.height = (el.scrollHeight)+"px";
}

function main() {

    let s = [];
	s.push('<div style="position:fixed; top:0; left:0; width:100%; background:#808080; display:flex;">'); // title bar
	s.push(' <div style="float:left; width:100%; display:flex; flex-flow:column; justify-content:space-around;">'); // buttons area
    s.push('<table width="100%"><tr><td>');
    s.push(`<textarea id="chat_text" oninput="auto_grow_text_area(this)" style="box-sizing: border-box;"></textarea>`);
    s.push('</td><td valign="bottom" width="80px">');
    s.push('<button onclick="on_post_message()">Post</button>');
    s.push('<button onclick="update_board()">Update</button>');
    s.push('</td></tr></table>');
	s.push(' </div>'); // end buttons area
	s.push('</div>'); // end title bar
	s.push('<br><br><br><br>'); // space under the title bar
    s.push('<table id="chats" width="100%"></table>');
    let the_content = document.getElementById('content');
	the_content.innerHTML = s.join('');
    setInterval(update_board, 500);
    // Set up the compose area
    let chat_text = document.getElementById('chat_text');
    auto_grow_text_area(chat_text);
}

main();
