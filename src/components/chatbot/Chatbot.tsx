import React, { useState } from 'react';
import { ChatbotIcon } from './ChatbotIcon';
import { ChatbotPanel } from './ChatbotPanel';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ChatbotIcon onClick={toggleChat} isOpen={isOpen} />
      <ChatbotPanel isOpen={isOpen} onClose={closeChat} />
    </>
  );
}