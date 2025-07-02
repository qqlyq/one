import React, { useState, useRef, useEffect } from "react";
import "../../styles/AvatarChat.css";

const AvatarChat = ({ onClose,placeholder = "Type your message..." , activity,onPlayAudio,isDescriptionPage = false}) => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: isDescriptionPage
        ? "Do you want to play the audio for this activity?"
        : "Hi! I'm your travel buddy. Ask me anything."
    }
  ]);
  const [input, setInput] = useState("");
  const [showPlayAudioPrompt, setShowPlayAudioPrompt] = useState(true); 
  const messagesEndRef = useRef(null);
  const [waitingForAudioReply, setWaitingForAudioReply] = useState(isDescriptionPage);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    const lower = input.toLowerCase();
  
    // If the play-audio prompt is still active
    if (showPlayAudioPrompt && isDescriptionPage) {
      if (["yes", "y", "sure", "ok"].includes(lower)) {
        if (typeof onPlayAudio === "function") {
          onPlayAudio();
        }
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: "Great! Audio is playing. Ask me anything about the activity." }]);
        }, 500);
      } else {
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: "No problem. Ask me anything about the activity!" }]);
        }, 500);
      }
  
      // Disable the prompt after first interaction
      setShowPlayAudioPrompt(false);
      setInput("");
      return;
    }
  
    // Default message generation
    const reply = generateReply(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 500);
    setInput("");
  };
  


  const generateReply = (text) => {
    const lower = text.toLowerCase();
    console.log(waitingForAudioReply)
    if (waitingForAudioReply) {
    if (lower.includes("play audio") || lower.includes("start audio")) {
      if (typeof onPlayAudio === "function") {
        onPlayAudio();
      }
      return "Playing the audio now!";
    }
  }else {
    return "Not on description page"
  }
  
    if (/\bhello\b/.test(lower) || /\bhi\b/.test(lower)) {
      return "Hello there!";
    } else if (lower.includes("your name")) {
      return "I'm AvatarBot!";
    } else if (lower.includes("travel")) {
      return "I love traveling! Where do you want to go?";
    } else if (lower.includes("what") && lower.includes("activity")) {
      if (activity) {
        return `${activity.name}: ${activity.description || "No description available."}`;
      } else {
        return "I'm not sure which activity you're referring to.";
      }
    }
  
    return "Try asking about the activity, like 'What is this activity about?'";
  };
  
  return (
    <div className="avatar-chat-wrapper">
      <div className="chat-container">
    <div className="chat-header">
      Travel Buddy
    <button className="chat-close-btn" onClick={onClose}>×</button>
    </div>
    {/* {new-------} */}


    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.from}`}>
          {msg.text}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <div className="input-area">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
</div>

  );
};

export default AvatarChat;
