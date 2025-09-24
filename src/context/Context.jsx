
import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [memory, setMemory] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const apiUrl = "http://localhost:3001/api";

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/users`);
        const data = await response.json();
        setUsers(data);
        if (data.length > 0) {
          setCurrentUser(data[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chat history when currentUser changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`${apiUrl}/history/${currentUser.id}`);
          const data = await response.json();
          setChatHistory(data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
    fetchHistory();
  }, [currentUser]);


  useEffect(() => {
    const storedMemory = localStorage.getItem("gemini-memory");
    if (storedMemory) {
      setMemory(JSON.parse(storedMemory));
    }
  }, []);

  const saveMemory = (newMemory) => {
    setMemory(newMemory);
    localStorage.setItem("gemini-memory", JSON.stringify(newMemory));
  }

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const currentPrompt = prompt !== undefined ? prompt : input;

    if (prompt === undefined) {
        setPrevPrompts(prev => [...prev, input]);
    }
    setRecentPrompt(currentPrompt);

    if (currentPrompt.toLowerCase().startsWith("remember that") || currentPrompt.toLowerCase().startsWith("store this")) {
      const fact = currentPrompt.replace(/^(remember that|store this)/i, "").trim();
      if (fact) {
        const newMemory = [...memory, fact];
        saveMemory(newMemory);
        setResultData("I've saved that for you.");
      } else {
        setResultData("Please provide something to remember.");
      }
      setLoading(false);
      setInput("");
      return;
    }

    if (currentPrompt.toLowerCase().startsWith("forget that") || currentPrompt.toLowerCase().startsWith("delete this")) {
      const factToRemove = currentPrompt.replace(/^(forget that|delete this)/i, "").trim();
      if (factToRemove) {
        const newMemory = memory.filter(item => item.toLowerCase() !== factToRemove.toLowerCase());
        if (newMemory.length < memory.length) {
            saveMemory(newMemory);
            setResultData("I've forgotten that for you.");
        } else {
            setResultData("I don't have that in my memory.");
        }
      } else {
        // forget all
        saveMemory([]);
        setResultData("I've cleared my memory.");
      }
      setLoading(false);
      setInput("");
      return;
    }

    const memoryContext = memory.length > 0 ? `Remember the following facts: ${memory.join(". ")}. ` : "";
    const promptWithMemory = memoryContext + currentPrompt;

    const response = await runChat(promptWithMemory, chatHistory);
    
    // Save to backend
    if (currentUser) {
        try {
            await fetch(`${apiUrl}/history/${currentUser.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt, response: response })
            });
        } catch (error) {
            console.error("Error saving chat history:", error);
        }
    }

    setChatHistory(prev => [...prev, {prompt: currentPrompt, response: response}]);

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const clearChatHistory = async () => {
    if (currentUser) {
        try {
            await fetch(`${apiUrl}/history/${currentUser.id}`, { method: 'DELETE' });
            setChatHistory([]);
            setPrevPrompts([]);
            setLoading(false);
            setShowResult(false);
        } catch (error) {
            console.error("Error clearing chat history:", error);
        }
    }
  }

  const switchUser = (user) => {
    setCurrentUser(user);
  }

  const addUser = async (name) => {
    try {
        const response = await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const newUser = await response.json();
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
    } catch (error) {
        console.error("Error adding user:", error);
    }
  }

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResult,
    loading,
    resultData,
    newChat,
    chatHistory,
    clearChatHistory,
    users,
    currentUser,
    switchUser,
    addUser
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
