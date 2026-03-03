# Chat Application Frontend

A modern AI-powered chat interface built with React and Vite, featuring conversation management and real-time responses.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Groq API** - Llama 3.3 70B AI model
- **React Markdown** - Message formatting
- **Syntax Highlighter** - Code highlighting

## Installation

```bash
npm install
```

## Setup

Create a `.env` file in the frontend directory:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from: https://console.groq.com

## Run Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Features

- 💬 Conversation-based chat system
- 📝 Markdown formatting with code highlighting
- 🎨 Typing indicator animation
- 📋 Copy and regenerate message actions
- 💾 Local storage for conversation history
- ⚡ Rate limiting (19 requests/day)
- 🔄 Message timestamps

## Project Structure

```
src/
├── components/
│   ├── Main/           # Chat interface
│   └── Sidebar/        # Conversation list
├── context/            # State management
├── config/             # API configuration
└── assets/             # Icons and images
```

## Build for Production

```bash
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
