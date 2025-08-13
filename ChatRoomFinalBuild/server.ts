import * as http from 'http';
import * as fs from 'fs/promises';
import * as path from 'path';

const host = '127.0.0.1';
const port = 8080;

let count = 0;
interface ChatMessage {
    action: string;
    text_id: number;
    text: string;
    messageID: number;
    username: string;
    timestamp: string;
    posted: boolean;
}

let convo: ChatMessage[] = [];

const someMimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.ico': 'image/png',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
};

// Utility function to parse an ISO string into a Date object
const parseISOString = (s: string): Date => {
    const b = s.split(/\D+/);
    return new Date(Date.UTC(+b[0], +b[1] - 1, +b[2], +b[3], +b[4], +b[5], +b[6]));
};

const requestListener: http.RequestListener = async (request, response) => {
    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', async () => {
        console.log(`Got a request for ${request.url}, body=${body}`);
        let filename = (request.url || '').substring(1); // Remove the leading '/'
        if (filename.length === 0) {
            filename = 'client.html';
        }

        const extension = path.extname(filename);

        if (filename === 'generated.html') {
            response.setHeader('Content-Type', 'text/html');
            response.writeHead(200);
            response.end(`<html><body><h1>Random number: ${Math.random()}</h1></body></html>`);
        } else if (filename === 'ajax') {
            try {
                const payload = JSON.parse(body);

                response.setHeader('Content-Type', 'application/json');
                response.writeHead(200);
                let ret: any;

                switch (payload.action) {
                    case 'chat':
                        const newMessage: ChatMessage = {
                            action: payload.action,
                            text_id: payload.text_id,
                            text: payload.text,
                            messageID: payload.messageID,
                            username: payload.username,
                            timestamp: new Date().toISOString(),
                            posted: payload.posted,
                        };
                        convo.push(newMessage);
                        ret = payload;
                        break;
                    case 'update':
                        ret = { chats: convo.slice(payload.pos) };
                        break;
                    case 'logIn':
                        console.log('Inside chat.js');
                        ret = payload;
                        console.log(`ret is`, ret);
                        break;
                    default:
                        ret = { error: 'Unknown action' };
                        break;
                }

                response.end(JSON.stringify(ret));
            } catch (err) {
                console.error('Error processing AJAX request', err);
                response.writeHead(400);
                response.end(JSON.stringify({ error: 'Bad request' }));
            }
        } else if (extension in someMimeTypes) {
            try {
                const data = await fs.readFile(filename);
                response.setHeader('Content-Type', someMimeTypes[extension]);
                response.writeHead(200);
                response.end(data);
            } catch (err) {
                console.error(`File not found: ${filename}`);
                response.setHeader('Content-Type', 'text/html');
                response.writeHead(404);
                response.end(
                    `<html><body><h1>404 - Not Found</h1><p>There is no file named "${filename}".</body></html>`
                );
            }
        } else {
            response.setHeader('Content-Type', 'text/html');
            response.writeHead(404);
            response.end(`<html><body><h1>404 - Not Found</h1><p>Unknown resource: "${filename}".</body></html>`);
        }
    });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
