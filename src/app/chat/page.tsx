"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { answerQuestion } from "@/ai/flows/answer-question";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything about this document.", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const userMessage = { text: newMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Call to backend to get AI response
      try {
        const aiResponse = await answerQuestion({
          question: newMessage,
          sessionId: "123", // TODO: Replace with actual session ID
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          {
            text: aiResponse.answer,
            isUser: false,
          },
        ]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          {
            text: "Sorry, I encountered an error while processing your request.",
            isUser: false,
          },
        ]);
      }

      setNewMessage("");
    }
  };

  const handleNewDocument = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-secondary p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Current Document</h1>
        <Button variant="outline" onClick={handleNewDocument}>
          Upload New Document
        </Button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.isUser ? "bg-primary text-primary-foreground self-end" : "bg-muted self-start"
            }`}
          >
            {message.text}
          </div>
        ))}
      </main>

      <div className="p-4 flex items-center">
        <Input
          type="text"
          placeholder="Ask a question about this document…"
          className="flex-1 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage}>
          Send <Send className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
