# Synchronized Phrase Player

## Description

The Synchronized Phrase Player is a web application that allows multiple clients to join a session where they collectively speak a predefined text. Each client is assigned a unique voice and color, and they take turns speaking phrases from the text in a synchronized manner. The application uses WebSockets for real-time communication and the Web Speech API for text-to-speech functionality.

## Features

- Multi-client synchronization
- Unique voice assignment for each client
- Visual feedback with color-coded displays
- Fullscreen mode for immersive experience
- Server-side control for consistent playback across clients

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12.0.0 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/synchronized-phrase-player.git
   cd synchronized-phrase-player
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   node server.js
   ```
   By default, the server will run on port 3000.

2. To use the same voice for all clients, start the server with the `--same-voice` flag:
   ```
   node server.js --same-voice
   ```

3. Open a web browser and navigate to `http://localhost:3000` (replace `localhost` with your server's IP address if accessing from other devices on the network).

4. Click the "Join Session" button to enter fullscreen mode and start participating.

5. Repeat step 3 on other devices or browsers to add more clients to the session.

## How It Works

- The server manages the distribution of phrases and synchronization between clients.
- Each client is assigned a unique voice and color upon joining.
- Clients take turns speaking phrases from the predefined text.
- The screen flashes with the client's assigned color when it's their turn to speak.
- The application uses the Web Speech API for text-to-speech functionality.

## Customization

- To modify the text being spoken, edit the `fullText` variable in `server.js`.
- To add or remove voices, modify the `voices` array in `server.js`.
- Adjust timing and synchronization by modifying the delay values in `server.js`.

## Troubleshooting

- If you encounter issues with voice assignment or playback, ensure that your browser supports the Web Speech API.
- For network-related issues, check your firewall settings and ensure that the server port (default 3000) is accessible.

## Contributing

Contributions to the Synchronized Phrase Player are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.