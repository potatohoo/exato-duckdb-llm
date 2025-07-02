// LLMChat.jsx
import { askLLM } from "./api/api"; //
import React, { useState } from "react";
import { MessageSquare, Send, Bot, User } from 'lucide-react';

const LLMChat = ({ llmMessages, setLlmMessages }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLlmMessages((prev) => [...prev, userMessage]);

    try {
      const aiAnswer = await askLLM(currentMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiAnswer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setLlmMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("LLM Error:", error);
      const errMessage = {
        id: Date.now() + 2,
        type: "ai",
        content: "Something went wrong. Please try again later.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setLlmMessages((prev) => [...prev, errMessage]);
    }

    setCurrentMessage('');
  };

  const clearLLMMessages = () => {
    setLlmMessages([]);
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
        </div>
        <button
          onClick={clearLLMMessages}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Clear Chat
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {llmMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">
              Start a conversation with the AI assistant
            </p>
            <p className="text-sm">
              Ask questions about your data or get analysis insights
            </p>
          </div>
        ) : (
          llmMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start max-w-3xl ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.type === "user"
                      ? "bg-blue-100 ml-3"
                      : "bg-purple-100 mr-3"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="mb-1">{message.content}</p>
                  <p
                    className={`text-xs ${
                      message.type === "user"
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-gray-50 rounded-b-xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything about your data..."
            className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim()}
            className="px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LLMChat;
