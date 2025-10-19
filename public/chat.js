// Base code taken from:
// https://javascript.plainenglish.io/how-i-built-a-real-time-chat-app-using-only-vanilla-javascript-and-websockets-f0fcb1af030bhttps://javascript.plainenglish.io/how-i-built-a-real-time-chat-app-using-only-vanilla-javascript-and-websockets-f0fcb1af030b
const form = document.querySelector('.send_message_container');
const input = document.getElementById('msg');
const messages = document.getElementById('messages');
const socket = new WebSocket("ws://localhost:8000");
const newChannelNameInput = document.getElementById('new_channel_input');
const dropDrown = document.getElementById('channel_selection');

const savedChannels = getLocalStorageValuesWithNumericKeys();

const defaultChannel = 'home';

// initialize and set current channel

let currentChannel = defaultChannel;

// Loop through all saved channels and add them to the dropdown
savedChannels.forEach(channelName => {
    addOptionInDropDown(channelName);
});

if (!savedChannels.includes(defaultChannel)){
  let nextKey = localStorage.length; 
  
  localStorage.setItem(nextKey, defaultChannel);
  addOptionInDropDown(defaultChannel);
}


// Get and save username in local storage
let username = localStorage.getItem('username');
while (!username || username == "") {
  username = prompt('Enter your username:');
  localStorage.setItem('username', username);
}

// displays chat messages
function displayMessage(username, message) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${username.toUpperCase()}</strong>: ${message}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// make sure dropdown value is current channel
dropDrown.value = currentChannel;


// helper function that loops thorugh local storage to get channels
function getLocalStorageValuesWithNumericKeys() {
    const filteredValues = [];
    const numericKeyPattern = /\d/;

    // go through all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // check if key contains number
        if (numericKeyPattern.test(key)) {
            const value = localStorage.getItem(key);
            
            // Store the value
            filteredValues.push(value);
        }
    }

    return filteredValues;
}

function addOptionInDropDown(optionName){
  const newOption = document.createElement('option')
  newOption.value = optionName;
  newOption.textContent = optionName;

  dropDrown.appendChild(newOption);

  // set channel to new channel
  dropDrown.value = newOption.value;
}


function connectToChannel(channelName){
  // visually reset chat messages
  messages.innerHTML = '';

  // update channel
  currentChannel = channelName;
  dropDrown.value = channelName;

  const data = {
    type: 'join',
    username: username, 
    message: 'join',
    channel: channelName
  }
    
    socket.send(JSON.stringify(data));
}

// -------------------- Event Listeners --------------------

socket.addEventListener("open", () => {
    connectToChannel(currentChannel);
});

// user submits message
form.addEventListener('submit', (event) => {
 const data = {
  type: 'message',
  username: username, 
  message: input.value,
  channel: dropDrown.value
 }
  
  event.preventDefault();
  socket.send(JSON.stringify(data));
  input.value = "";
});

// user types in channel nam,e
newChannelNameInput.addEventListener('blur', ()=>{
  const newChannelName = newChannelNameInput.value.trim();

  if (!newChannelName) return;

  // Check if the channel already exists in the dropdown
  const existingOptions = Array.from(dropDrown.options).map(option => option.value);

  if (!existingOptions.includes(newChannelName)){
    // Save the channel name to localStorage
    localStorage.setItem(localStorage.length, newChannelName);
    // Add new channel to dropdown
    addOptionInDropDown(newChannelName);
  } else {
      // Set the dropdown to the existing channel
      dropDrown.value = newChannelName;
  }

  // connects to new channel
  connectToChannel(dropDrown.value);

  // reset input
  newChannelNameInput.value = "";
})

dropDrown.addEventListener('change', ()=>{
  connectToChannel(dropDrown.value);
})

// server sends data to client through web socket
socket.addEventListener("message", (event) => {
  const info = JSON.parse(event.data)

  // only display messages of currently selected channel
  if (info.channel === currentChannel) {
    displayMessage(info.username, info.message);
  }
})