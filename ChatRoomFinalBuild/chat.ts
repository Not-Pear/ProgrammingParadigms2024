//export {};
const g_id: number = Math.floor(Math.random() * 10000000);
let g_messages: ChatMessage[] = [];
let id: number;
let username: string | undefined;

interface ChatMessage {
    action: string;
    text_id: number;
    text: string;
    messageID: number;
    username: string;
    timestamp: string | null;
    posted: boolean;
}

// Utility function to sanitize text inputs
function scrub(text: string): string {
    if (!text) {
        text = '';
    }
    return text
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/\n/g, '<br>')
        .replace(/  /g, ' &nbsp;');
}

// Function to make POST requests
async function postHttp(payload: any, callback: (response: any) => void): Promise<void> {
    const body = JSON.stringify(payload);
    try {
        const response = await fetch('ajax', {
            body,
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });

        const text = await response.text();
        const responseObj = JSON.parse(text);

        responseObj.chats.forEach((chat: ChatMessage) => {
            g_messages.push(chat);
            const safeTimestamp = chat.timestamp ?? ''; // Fallback to an empty string if null
            if (chat.text_id !== g_id) {
                post_message(false, safeTimestamp, chat.messageID, chat.username, chat.text);
            } else {
                update_messages(chat.messageID, safeTimestamp, chat.username);
            }
        });

        callback(responseObj);
    } catch (error) {
        console.error('Error in postHttp:', error);
    }
}


// Updates the chat board by fetching the latest messages
function update_board(): void {
    const payload = {
        action: 'update',
        text_id: g_id,
        pos: g_messages.length,
    };
    postHttp(payload, send_callback);
}

// Callback function for handling postHttp responses
function send_callback(response: any): void {
    console.log('Callback response:', response);
}

// Updates specific messages on the UI
function update_messages(messageID: number, timestamp: string, username: string): void {
    const message = document.getElementById(`id${messageID}`);
    if (message) {
        const dateStamp = message.querySelector('.date_stamp');
        const userName = message.querySelector('.user_name');

        if (dateStamp) dateStamp.innerHTML = timestamp;
        if (userName) userName.innerHTML = username;
    }
}

// Posts a new message to the chat UI
function post_message(is_me: boolean, timestamp: string | null, messageID: number, username: string, text: string): void {
    timestamp = scrub(timestamp || '');
    username = scrub(username);
    text = scrub(text);

    const chatsTable = document.getElementById('chats') as HTMLTableElement;
    const newRow = chatsTable.insertRow();
    const cell = newRow.insertCell(0);

    const s: string[] = [
        `<div class="${is_me ? 'bubble_right' : 'bubble_left'}">`,
        `<span class="date_stamp">${timestamp}</span><br>`,
        `<span class="user_name">${username}</span><br>`,
        `<code>${text}</code>`,
        `</div>`,
    ];

    cell.id = `id${messageID}`;
    cell.innerHTML = s.join('');
    cell.scrollIntoView({ behavior: 'smooth' });
}

// Handles sending a new message
function on_post_message(): void {
    const textArea = document.getElementById('chat_text') as HTMLTextAreaElement;
    if (!textArea) return;

    const timestamp = '';
    const messageID = Math.floor(Math.random() * 10000000);

    post_message(true, timestamp, messageID, username || 'Anonymous', textArea.value);

    const payload: ChatMessage = {
        action: 'chat',
        text_id: g_id,
        text: textArea.value,
        messageID,
        username: username || 'Anonymous',
        timestamp: null,
        posted: false,
    };

    postHttp(payload, send_callback);
    textArea.value = '';
    auto_grow_text_area(textArea);
    textArea.focus();
}

// Automatically resizes the text area as content grows
function auto_grow_text_area(el: HTMLTextAreaElement): void {
    el.style.height = '5px';
    el.style.height = `${el.scrollHeight}px`;
}


const on_push = (): void => {
    postData();
};

async function postData(): Promise<void> {
    try {
        const usernameElement = document.getElementById("username") as HTMLInputElement;
        if (!usernameElement) {
            console.error("Username input element not found.");
            return;
        }

        const name: string = usernameElement.value;

        const payload = {
            action: 'logIn',
            name: name,
        };

        const response = await fetch('ajax', {
            body: JSON.stringify(payload),
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
        });

        const text = await response.text();
        const response_ob = JSON.parse(text);

        const loginElement = document.getElementById("login");
        if (loginElement) {
            loginElement.innerHTML = "";
        } else {
            console.error("Login element not found.");
        }

        chat(name);
    } catch (ex) {
        console.error(`An error occurred: ${ex instanceof Error ? ex.message : ex}`);
        if (ex instanceof Error) {
            console.error(ex.stack);
        }
    }
}


// Initializes the chat interface
function chat(name: string): void {
    username = name;
    const s: string[] = [
        '<div style="position:fixed; top:0; left:0; width:100%; background:#808080; display:flex;">',
        '<div style="float:left; width:100%; display:flex; flex-flow:column; justify-content:space-around;">',
        '<table width="100%"><tr><td>',
        '<textarea id="chat_text" oninput="auto_grow_text_area(this)" style="box-sizing: border-box;"></textarea>',
        '</td><td valign="bottom" width="80px">',
        '<button onclick="on_post_message()">Post</button>',
        '<button onclick="update_board()">Update</button>',
        '</td></tr></table>',
        '</div>',
        '</div>',
        '<br><br><br><br>',
        '<table id="chats" width="100%"></table>',
    ];

    const theContent = document.getElementById('content');
    if (theContent) {
        theContent.innerHTML = s.join('');
    }

    setInterval(update_board, 500);

    const chatText = document.getElementById('chat_text') as HTMLTextAreaElement;
    if (chatText) {
        auto_grow_text_area(chatText);
    }
}

// Main function to initialize the application
function main(): void {
    console.log('Chat application initialized');
}

main();
