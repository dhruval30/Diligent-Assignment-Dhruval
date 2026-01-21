import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#131314] text-gray-100 overflow-hidden font-sans antialiased selection:bg-blue-500/30">
        <ChatInterface />
    </div>
  );
}

export default App;