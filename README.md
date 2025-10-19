# 💬 Realtime Chat App

This project implements a real-time, channel-based messaging service using modern asynchronous architecture. It allows multiple users to connect to the same server, switch between segregated chat rooms (channels), and ensures that all chat history is permanently saved across server restarts. <br>

The core challenge involved managing concurrent connections via WebSockets and maintaining separate state for each channel.

## ✨ Features
* **Real-Time Asynchronous Core**: Built with Python asyncio and WebSockets for non-blocking, instantaneous message transfer.
* **Persistent History**: All chat history for all channels is saved upon every new message.
* **Dynamic Channel Creation**: Users can create new chat channels directly from the frontend, which are automatically added to the persistent history.

## 🛠️ Tech Stack
* Python
* asyncio (Python's built-in asynchronous I/O framework)
* WebSockets
* Vanilla JavaScript

## 🎞️ Preview
[Video Preview](https://github.com/user-attachments/assets/e0913dc7-6fec-46f7-9fcc-c9ca2b05941b)

## ⚙️ How to run

1. Clone the repository. <br>
``` git clone https://github.com/MelaniaChiru/Realtime-Chat-App.git ```
2. Set up Python Enviroment (this can be done within a virtual environment): <br>
``` pip install websockets ```
3. Start backend server <br>
``` python chat_server.py ```
4. Navigate to `index.html` and open it in your browser.

>[!IMPORTANT]
> When the page first loads, it prompts users to input a username; this username is then saved in Localhost, therefore to simulate 2 users chatting, you have to open the app in 2 different browsers.

## 💭 Future Improvements
* Currently, data is only perststent within the server process; If the server stops, all chat history is lost. A good feature to add would be to ensure that data is never lost when the server is stopped or restarted.
* Right now, if a user creates a new channel, other users do not automatically detect the creation of this new channel. They have to create a 'new' channel with the same name to be able to enter that channel and see the message history and interact with it.
