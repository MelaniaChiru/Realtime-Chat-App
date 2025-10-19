# Realtime Chat App

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
``` Comming Soon ```

## ⚙️ How to run

1. Clone the repository.
2. Set up Python Enviroment (this can be done within a virtual environment)
3. Start backend server
4. Navigate to `index.html` and open it in your browser.

## 💭 Future Improvements
* Currently, data is only perststent within the server process; If the server stops, all chat history is lost. A good feature to add would be to ensure that data is never lost when the server is stopped or restarted.
