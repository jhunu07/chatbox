# Gemini AI Chatbox

A modern, interactive AI chatbot application powered by Google's Gemini 2.0 Flash API. Built with React and Vite, this application provides a sleek chat interface with conversation history, multi-user support, and memory capabilities.

## Features

- **AI-Powered Conversations**: Chat with Google's Gemini 2.0 Flash model
- **Multi-User Support**: Create and switch between multiple user profiles
- **Conversation History**: View and reload previous conversations
- **Memory System**: Store facts that persist across conversations using commands like "Remember that..." or "Store this..."
- **Responsive UI**: Clean and intuitive interface with collapsible sidebar
- **Real-time Typing Effect**: Animated response display for a natural chat experience

## Technologies Used

- **Frontend**:
  - React 19
  - Vite 7
  - CSS3
- **Backend**:
  - Node.js
  - Express.js
  - CORS
- **AI**:
  - Google Generative AI (Gemini 2.0 Flash)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)
- A Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/))

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jhunu07/chatbox.git
   cd chatbox
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Usage

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend Server (Optional)

The application includes support for a backend server to enable multi-user support and persistent chat history. If the backend is set up, start it with:
```bash
npm run server
```

The backend server runs on `http://localhost:3001`

> **Note**: The backend server is optional. The application works without it using local storage for memory persistence.

### Build for Production

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

## Project Structure

```
chatbox/
├── src/
│   ├── assets/           # Icons and images
│   ├── components/
│   │   ├── Main/         # Main chat interface
│   │   └── Sidebar/      # Navigation sidebar
│   ├── config/
│   │   └── gemini.js     # Gemini API configuration
│   ├── context/
│   │   └── Context.jsx   # React context for state management
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Memory Commands

The chatbot supports special commands for memory management:

- **Store a fact**: Start your message with "Remember that" or "Store this"
  ```
  Remember that my favorite color is blue
  ```

- **Remove a fact**: Start your message with "Forget that" or "Delete this"
  ```
  Forget that my favorite color is blue
  ```

- **Clear all memory**: Send "Forget that" or "Delete this" without any additional text

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the powerful AI capabilities
- [Vite](https://vitejs.dev/) for the fast development experience
- [React](https://react.dev/) for the UI framework
