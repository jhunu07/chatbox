import { useState, useEffect } from "react";
import runChat from "../config/gemini";
import { Context } from "./ContextInstance";

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [error, setError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [abortController, setAbortController] = useState(null);
  const MAX_REQUESTS_PER_DAY = 19;
  
  // Conversation-based state
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);

  useEffect(() => {
    // Load conversations from localStorage
    const storedConversations = localStorage.getItem("conversations");
    if (storedConversations) {
      try {
        const parsed = JSON.parse(storedConversations);
        setConversations(parsed);
      } catch (e) {
        console.error("Failed to load conversations:", e);
      }
    }

    // Load request count from localStorage
    const today = new Date().toDateString();
    const storedData = localStorage.getItem("rate-limit-data");
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        setRequestCount(count);
      } else {
        // Reset count for new day
        localStorage.setItem("rate-limit-data", JSON.stringify({ date: today, count: 0 }));
        setRequestCount(0);
      }
    } else {
      localStorage.setItem("rate-limit-data", JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const incrementRequestCount = () => {
    const today = new Date().toDateString();
    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem("rate-limit-data", JSON.stringify({ date: today, count: newCount }));
  }

  const newChat = () => {
    // Create a new conversation
    const newConvId = Date.now().toString();
    setCurrentConversationId(newConvId);
    setCurrentMessages([]);
    setLoading(false);
    setShowResult(false);
    setError(null);
    setResultData("");
    setRecentPrompt("");
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
      setError("Generation stopped by user");
    }
  };

  const regenerateResponse = async () => {
    if (!recentPrompt) return;
    
    // Remove last assistant message
    if (currentMessages.length > 0) {
      const newMessages = currentMessages.slice(0, -1);
      setCurrentMessages(newMessages);
      
      // Update conversation
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: newMessages, updatedAt: new Date().toISOString() }
            : conv
        ));
      }
    }
    
    // Resend the prompt
    await onSent(recentPrompt);
  };

  const onSent = async (prompt) => {
    setError(null);

    // Check rate limit
    if (requestCount >= MAX_REQUESTS_PER_DAY) {
      setError(`Daily limit reached! You can make ${MAX_REQUESTS_PER_DAY} requests per day. Come back tomorrow!`);
      setShowResult(true);
      return;
    }

    setResultData("");
    setLoading(true);
    setShowResult(true);

    const currentPrompt = prompt !== undefined ? prompt : input;

    if (prompt === undefined) {
      setPrevPrompts(prev => [...prev, input]);
    }
    setRecentPrompt(currentPrompt);

    // Create new conversation if none exists
    let convId = currentConversationId;
    if (!convId) {
      convId = Date.now().toString();
      setCurrentConversationId(convId);
    }

    // Add user message
    const userMessage = {
      role: "user",
      content: currentPrompt,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...currentMessages, userMessage];
    setCurrentMessages(updatedMessages);

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Convert messages to chat history format for API
      const chatHistoryForAPI = updatedMessages
        .filter(m => m.role === "assistant")
        .map((m, i) => ({
          prompt: updatedMessages.filter(msg => msg.role === "user")[i]?.content || "",
          response: m.content
        }));
      
      const response = await runChat(currentPrompt, chatHistoryForAPI, controller.signal);
      
      // Add assistant message
      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setCurrentMessages(finalMessages);
      setResultData(response);
      
      // Update or create conversation
      setConversations(prev => {
        const existingConvIndex = prev.findIndex(c => c.id === convId);
        const conversationData = {
          id: convId,
          title: currentPrompt.slice(0, 50),
          messages: finalMessages,
          createdAt: existingConvIndex >= 0 ? prev[existingConvIndex].createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (existingConvIndex >= 0) {
          const newConvs = [...prev];
          newConvs[existingConvIndex] = conversationData;
          return newConvs;
        } else {
          return [...prev, conversationData];
        }
      });
      
      incrementRequestCount();
    } catch (error) {
      if (error.name === 'AbortError') {
        setError("Request was cancelled");
      } else {
        console.error("Error in onSent:", error);
        setError(error.message || "Something went wrong. Please try again.");
      }
      setResultData("");
    } finally {
      setLoading(false);
      setInput("");
      setAbortController(null);
    }
  };

  const clearChatHistory = () => {
    if (window.confirm('Clear all conversations?')) {
      setConversations([]);
      setCurrentConversationId(null);
      setCurrentMessages([]);
      setPrevPrompts([]);
      setLoading(false);
      setShowResult(false);
      setError(null);
      setResultData("");
      localStorage.removeItem("conversations");
    }
  }

  const deleteConversation = (convId) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (currentConversationId === convId) {
      setCurrentConversationId(null);
      setCurrentMessages([]);
      setShowResult(false);
      setResultData("");
    }
    const remaining = conversations.filter(c => c.id !== convId);
    if (remaining.length === 0) {
      localStorage.removeItem("conversations");
    }
  }
  
  const loadConversation = (convId) => {
    const conversation = conversations.find(c => c.id === convId);
    if (conversation) {
      setCurrentConversationId(convId);
      setCurrentMessages(conversation.messages);
      setShowResult(true);
      
      // Set the last assistant message as result
      const lastAssistantMsg = conversation.messages
        .filter(m => m.role === "assistant")
        .pop();
      if (lastAssistantMsg) {
        setResultData(lastAssistantMsg.content);
      }
      
      // Set the last user message as recent prompt
      const lastUserMsg = conversation.messages
        .filter(m => m.role === "user")
        .pop();
      if (lastUserMsg) {
        setRecentPrompt(lastUserMsg.content);
      }
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
    conversations,
    currentConversationId,
    currentMessages,
    clearChatHistory,
    deleteConversation,
    loadConversation,
    setResultData,
    setShowResult,
    error,
    requestCount,
    maxRequests: MAX_REQUESTS_PER_DAY,
    stopGeneration,
    regenerateResponse
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
