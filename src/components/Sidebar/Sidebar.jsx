
import {React ,useContext,useState} from 'react'
import './Sidebar.css'
 import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
 
  const Sidebar = () => {

 const [extended,setExtended] = useState(false);
 const {
    onSent, 
    prevPrompts, 
    setRecentPrompt, 
    newChat, 
    chatHistory, 
    clearChatHistory, 
    setResultData, 
    setShowResult,
    users,
    currentUser,
    switchUser,
    addUser
} = useContext(Context)

 const loadPrompt = async (prompt) => {
  setRecentPrompt(prompt.prompt)
  setResultData(prompt.response)
  setShowResult(true)
 }

 const handleAddUser = () => {
    const name = prompt("Enter new user name:");
    if (name) {
        addUser(name);
    }
 }

  return (
    // SIDEBAR COMPONENT
    <div className='sidebar'>
        <div className='top'> 
            <img onClick={()=>setExtended(prev=>!prev)} className='menu'  src={assets.menu_icon} alt="icon" />
            <div onClick={()=>newChat()} className='new-chat'>
                <img src={assets.plus_icon} alt="logo" />
              {extended?<p>New Chat</p>:null}
            </div>

            {extended ?
            <div className="recent">
                <p className="recent-title">Users</p>
                <div className="users-list">
                    <select onChange={(e) => switchUser(users.find(u => u.id === e.target.value))} value={currentUser ? currentUser.id : ''}>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button onClick={handleAddUser}>Add User</button>
                </div>
            </div>
            : null}


            {extended?  
            <div className="recent">
                <p className="recent-title">Recent</p>
                {chatHistory.map((item,index)=>{
                  return (
                    <div key={index} onClick={()=>loadPrompt(item)} className="recent-entry">
                      <img src={assets.message_icon} alt="logo" />
                      <p>{item.prompt.slice(0,18)} ...</p>
                   </div>
                  )
                })}
            </div>
            : null}
            
        </div>
        {/* BOTTOM SECTION */}

      <div className='bottom'>
        <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" />
            {extended?<p>Help</p>:null}
        </div>
        <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" />
             {extended?<p onClick={()=>clearChatHistory()}>Clear Chat</p>:null}
        </div>
        <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            {extended?<p>Setting</p>:null}
        </div>

      </div>
    </div>
  )
}

export default Sidebar
