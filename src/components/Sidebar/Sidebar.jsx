import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets';
import { Context } from '../../context/ContextInstance';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const {
    setRecentPrompt,
    newChat,
    chatHistory,
    clearChatHistory,
    deleteChat,
    setResultData,
    setShowResult
  } = useContext(Context)

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setExtended(!extended);
  }

  // Start new chat
  const handleNewChat = () => {
    newChat();
    if (window.innerWidth <= 768) {
      setExtended(false); // Close on mobile
    }
  }

  // Load a previous chat
  const loadChat = (chat) => {
    setRecentPrompt(chat.prompt)
    setResultData(chat.response)
    setShowResult(true)
    if (window.innerWidth <= 768) {
      setExtended(false); // Close on mobile after selecting
    }
  }

  // Delete a specific chat
  const handleDeleteChat = (e, index) => {
    e.stopPropagation(); // Prevent loading the chat
    deleteChat(index);
  }

  // Show help popup
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  }

  return (
    <>
      <div className={`sidebar ${extended ? 'extended' : ''}`}>
        <div className='top'>
          {/* Menu toggle button */}
          <img 
            onClick={toggleSidebar} 
            className='menu' 
            src={assets.menu_icon} 
            alt="Menu" 
            title="Toggle Menu"
          />
          
          {/* New chat button */}
          <div onClick={handleNewChat} className='new-chat' title="Start New Chat">
            <img src={assets.plus_icon} alt="New Chat" />
            {extended && <p>New Chat</p>}
          </div>

          {/* Recent chats section */}
          {extended && (
            <div className="recent">
              <p className="recent-title">Recent Chats</p>
              {chatHistory.length > 0 ? (
                <div className="recent-list">
                  {chatHistory.slice(-10).reverse().map((chat, index) => {
                    const actualIndex = chatHistory.length - 1 - index;
                    return (
                      <div 
                        key={actualIndex} 
                        className="recent-entry"
                        onClick={() => loadChat(chat)}
                        title={chat.prompt}
                      >
                        <img src={assets.message_icon} alt="Chat" />
                        <p className="chat-text">{chat.prompt.slice(0, 20)}...</p>
                        <button 
                          className="delete-btn"
                          onClick={(e) => handleDeleteChat(e, actualIndex)}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="empty-message">No chats yet</p>
              )}
            </div>
          )}
        </div>

        {/* Bottom menu */}
        <div className='bottom'>
          <div 
            className="bottom-item recent-entry" 
            onClick={toggleHelp}
            title="Help"
          >
            <img src={assets.question_icon} alt="Help" />
            {extended && <p>Help</p>}
          </div>
          
          <div 
            className="bottom-item recent-entry" 
            onClick={clearChatHistory}
            title="Clear All Chats"
          >
            <img src={assets.history_icon} alt="Clear" />
            {extended && <p>Clear All</p>}
          </div>
          
          <div 
            className="bottom-item recent-entry"
            onClick={() => alert('Settings coming soon!')}
            title="Settings"
          >
            <img src={assets.setting_icon} alt="Settings" />
            {extended && <p>Settings</p>}
          </div>
        </div>
      </div>

      {/* Help popup */}
      {showHelp && (
        <div className="help-overlay" onClick={toggleHelp}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-help" onClick={toggleHelp}>✕</button>
            <h3>How to Use</h3>
            <ul>
              <li>💬 Type your question and press Enter or click Send</li>
              <li>🆕 Click "New Chat" to start fresh</li>
              <li>📜 Click recent chats to view previous conversations</li>
              <li>🗑️ Hover over chats and click ✕ to delete them</li>
              <li>⚡ You have {chatHistory.length} chats in history</li>
            </ul>
            <p className="help-note">💡 Tip: You can use "Remember that..." to save info!</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
