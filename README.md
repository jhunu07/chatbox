# Gemini Chat Application

A modern, responsive chat application powered by Groq's Llama 3.3 70B model. Built with React and Express, featuring a sleek UI with memory capabilities and chat history management.

## Features

- 🤖 **AI-Powered Chat**: Interact with Groq's Llama 3.3 70B Versatile model
- 💾 **Memory System**: Store and recall information across conversations
- 📜 **Chat History**: View and reload previous conversations
- 🎨 **Modern UI**: Clean, responsive interface with sidebar navigation
- ⚡ **Fast Response**: Real-time streaming with animated text display
- 🔄 **Session Management**: Clear chat history and start fresh anytime

## Technologies Used

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling
- **Context API** - State management

### Backend
- **Express.js** - Server framework
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request parsing

### AI Integration
- **Groq API** - Llama 3.3 70B Versatile model
- **Streaming responses** - Real-time text generation

## Project Structure

```
chat/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Main/          # Main chat interface
│   │   │   │   ├── Main.jsx
│   │   │   │   └── Main.css
│   │   │   └── Sidebar/       # Navigation sidebar
│   │   │       ├── Sidebar.jsx
│   │   │       └── Sidebar.css
│   │   ├── context/
│   │   │   └── Context.jsx    # Global state management
│   │   ├── config/
│   │   │   └── gemini.js      # Groq API integration
│   │   ├── assets/
│   │   │   └── assets.js      # Image and icon assets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── server/
    ├── index.js               # Express server
    ├── data.json              # Data storage
    └── package.json

```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com))

### Setup

1. **Clone or download the project**
   ```bash
   cd chat
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

## Running the Application

### Option 1: Run Frontend and Server Separately

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Server:**
```bash
cd server
node index.js
```

### Option 2: Run Both Concurrently (Recommended)

```bash
cd frontend
npm run dev:all
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Server: `http://localhost:3001`

## Usage

### Basic Chat
1. Type your message in the input box at the bottom
2. Press Enter or click the send icon
3. View AI responses in real-time with animated text

### Memory Commands

**Store Information:**
```
Remember that my favorite color is blue
Store this: I live in New York
```

**Recall Information:**
The AI will automatically use stored memories in context for future conversations.

**Remove Information:**
```
Forget that my favorite color is blue
Delete this: I live in New York
```

**Clear All Memory:**
```
Forget that
```

### Chat History
- Click any previous chat in the sidebar to reload it
- View recent conversations when sidebar is expanded
- Click "Clear Chat" to remove all chat history

### New Chat
- Click the "New Chat" button to start a fresh conversation
- Previous history is preserved in the sidebar

## Features in Detail

### Memory System
The application uses localStorage to persist memory across sessions. When you ask the AI to remember something, it stores that information and includes it as context in future prompts.

### Chat History
Recent conversations are displayed in the sidebar. Click any previous chat to view the full conversation again.

### Responsive Design
The interface adapts to different screen sizes with a collapsible sidebar for mobile devices.

## Configuration

### Change AI Model
Edit `frontend/src/config/gemini.js` to change the model:
```javascript
model: "llama-3.3-70b-versatile", // or other Groq models
```
Edit `frontend/src/context/Context.jsx`:
```javascript
}, 75 * index);  // Change 75 to adjust speed (milliseconds)
```

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start backend server
- `npm run dev:all` - Run both frontend and server

### Server
- `node index.js` - Start Express server

## Future Enhancements

- [ ] Export chat history
- [ ] Dark/Light theme toggle
- [ ] Markdown rendering for code blocks
- [ ] Voice input support
- [ ] Multiple conversation threads
- [ ] Cloud storage integration
- [ ] Custom AI personalities

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Powered by [Groq](https://groq.com) API
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Icons and assets from various sources

## Support

For issues or questions, please open an issue in the repository or contact the maintainer.

---

**Note:** Keep your API key secure and never commit it to version control. Always use environment variables for sensitive information.
