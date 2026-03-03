import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets';
import { Context } from '../../context/ContextInstance';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const {
    newChat,
    conversations,
    clearChatHistory,
    deleteConversation,
    loadConversation,
    currentConversationId
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

  // Load a previous conversation
  const handleLoadConversation = (convId) => {
    loadConversation(convId);
    if (window.innerWidth <= 768) {
      setExtended(false); // Close on mobile after selecting
    }
  }

  // Delete a specific conversation
  const handleDeleteConversation = (e, convId) => {
    e.stopPropagation(); // Prevent loading the conversation
    if (window.confirm('Delete this conversation?')) {
      deleteConversation(convId);
    }
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

          {/* Recent conversations section */}
          {extended && (
            <div className="recent">
              <p className="recent-title">Conversations</p>
              {conversations.length > 0 ? (
                <div className="recent-list">
                  {conversations.slice().reverse().map((conversation) => {
                    const isActive = conversation.id === currentConversationId;
                    return (
                      <div 
                        key={conversation.id} 
                        className={`recent-entry ${isActive ? 'active' : ''}`}
                        onClick={() => handleLoadConversation(conversation.id)}
                        title={conversation.title}
                      >
                        <img src={assets.message_icon} alt="Chat" />
                        <p className="chat-text">{conversation.title.slice(0, 25)}...</p>
                        <button 
                          className="delete-btn"
                          onClick={(e) => handleDeleteConversation(e, conversation.id)}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="empty-message">No conversations yet</p>
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
              <li>🆕 Click "New Chat" to start a fresh conversation</li>
              <li>📜 Click conversations to view previous chats</li>
              <li>🗑️ Hover over conversations and click ✕ to delete them</li>
              <li>⚡ You have {conversations.length} conversation(s)</li>
            </ul>
            <p className="help-note">💡 Tip: All messages in a conversation stay together!</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
