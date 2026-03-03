import React, { useContext, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets';
import { Context } from '../../context/ContextInstance';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const Main = () => {

    const {
        onSent,
        showResult,
        loading,
        setInput,
        input,
        error,
        requestCount,
        maxRequests,
        stopGeneration,
        regenerateResponse,
        currentMessages
    } = useContext(Context)

    const [copied, setCopied] = useState(false);

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        onSent(suggestion);
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
            e.preventDefault();
            onSent();
        }
    }

    const handleSend = () => {
        if (input.trim() && !loading) {
            onSent();
        }
    }

    return (

        <div className="main">
            <div className="nav">
                <p>Groq AI Chat</p>
                <div className="nav-right">
                    <span className="request-counter">{requestCount}/{maxRequests} requests today</span>
                    <img src={assets.user_icon} alt="User" />
                </div>
            </div>
            <div className='main-container'>

                {!showResult
                    ? <>
                        <div className="greet">
                            <p><span>Hello, User!</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleSuggestionClick("Suggest a beautiful place to visit on vacation")}>
                                <p>Suggest a place to visit</p>
                                <img src={assets.compass_icon} alt="Compass" />
                            </div>
                            <div className="card" onClick={() => handleSuggestionClick("Explain quantum computing in simple terms")}>
                                <p>Summarize this concept</p>
                                <img src={assets.bulb_icon} alt="Bulb" />
                            </div>
                            <div className="card" onClick={() => handleSuggestionClick("Give me creative project ideas for beginners")}>
                                <p>Suggest some ideas</p>
                                <img src={assets.message_icon} alt="Message" />
                            </div>
                            <div className="card" onClick={() => handleSuggestionClick("How can I improve code readability?")}>
                                <p>Improve code readability</p>
                                <img src={assets.code_icon} alt="Code" />
                            </div>
                        </div>
                    </>
                    : <div className='conversation-thread'>
                        {currentMessages.map((message, index) => (
                            <div key={index} className={`message ${message.role}`}>
                                <div className="message-header">
                                    <img 
                                        src={message.role === 'user' ? assets.user_icon : assets.gemini_icon} 
                                        alt={message.role} 
                                    />
                                    <span className="message-role">
                                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                                    </span>
                                    <span className="message-timestamp">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="message-content">
                                    {message.role === 'user' ? (
                                        <p>{message.content}</p>
                                    ) : (
                                        <div className='markdown-content'>
                                            <ReactMarkdown
                                                components={{
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                    {message.role === 'assistant' && index === currentMessages.length - 1 && (
                                        <div className="action-buttons">
                                            <button className='action-btn copy-btn' onClick={() => copyToClipboard(message.content)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                </svg>
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                            <button className='action-btn regenerate-btn' onClick={regenerateResponse}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="23 4 23 10 17 10"></polyline>
                                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                                </svg>
                                                Regenerate
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className='message assistant'>
                                <div className="message-header">
                                    <img src={assets.gemini_icon} alt="AI" />
                                    <span className="message-role">AI Assistant</span>
                                </div>
                                <div className="message-content">
                                    <div className='typing-indicator'>
                                        <div className='typing-dot'></div>
                                        <div className='typing-dot'></div>
                                        <div className='typing-dot'></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className='error-message'>
                                <p>Error: {error}</p>
                            </div>
                        )}
                    </div>
                }


                <div className="main-bottom">
                    <div className="search-box">
                        <button className="plus-btn" title="New Chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="Ask anything"
                            className="text"
                            onKeyPress={handleKeyPress}
                            disabled={loading || requestCount >= maxRequests}
                        />
                        <button className="mic-btn" title="Voice Input">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>
                        {loading ? (
                            <button className="stop-btn-icon" onClick={stopGeneration} title="Stop Generation">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="6" width="12" height="12" rx="2"></rect>
                                </svg>
                            </button>
                        ) : (
                            <button
                                className="send-btn-icon"
                                onClick={handleSend}
                                disabled={!input.trim() || requestCount >= maxRequests}
                                title="Send Message"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="bottom-info">
                        Powered by Groq & Llama 3.3 70B
                    </p>
                </div>
            </div>

        </div>


    )
}

export default Main
