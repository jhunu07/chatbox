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
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [abortController, setAbortController] = useState(null);
  const MAX_REQUESTS_PER_DAY = 19;

  useEffect(() => {
    // Load chat history from localStorage
    const storedHistory = localStorage.getItem("chat-history");
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        setChatHistory(parsed);
      } catch (e) {
        console.error("Failed to load chat history:", e);
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

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chat-history", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const incrementRequestCount = () => {
    const today = new Date().toDateString();
    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem("rate-limit-data", JSON.stringify({ date: today, count: newCount }));
  }

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setError(null);
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
    
    // Remove last response from history
    if (chatHistory.length > 0) {
      const newHistory = chatHistory.slice(0, -1);
      setChatHistory(newHistory);
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

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await runChat(currentPrompt, chatHistory, controller.signal);
      const newChatEntry = { 
        prompt: currentPrompt, 
        response: response,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, newChatEntry]);
      setResultData(response);
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
    if (window.confirm('Clear all chat history?')) {
      setChatHistory([]);
      setPrevPrompts([]);
      setLoading(false);
      setShowResult(false);
      setError(null);
      localStorage.removeItem("chat-history");
    }
  }

  const deleteChat = (index) => {
    const newHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(newHistory);
    if (newHistory.length === 0) {
      localStorage.removeItem("chat-history");
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
    deleteChat,
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
