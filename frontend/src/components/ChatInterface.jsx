import { ArrowUp, ChevronDown, ChevronUp, Sparkles, Terminal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMsg = { 
        role: 'assistant', 
        content: data.response,
        logs: data.logs || [] 
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please ensure the neural core is online.", logs: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-5xl mx-auto relative overflow-hidden">
      
      <div className="px-4 md:px-6 py-4 md:py-5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 cursor-default">
           <span className="text-lg md:text-xl font-medium tracking-tight text-gray-200">Jarvis</span>
           <span className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 px-2 py-0.5 rounded font-mono border border-white/5">built by dhruval</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-0 pb-44 scrollbar-hide">
        {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center -mt-10 md:-mt-20 space-y-4 md:space-y-6 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards px-6 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] shrink-0">
                  <Sparkles className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h1 className="text-3xl md:text-5xl font-medium text-transparent bg-clip-text bg-linear-to-b from-gray-100 to-gray-500 tracking-tight">
                Good afternoon, Dhruval.
              </h1>
           </div>
        ) : (
           <div className="space-y-8 md:space-y-12 pt-4 md:pt-8">
             {messages.map((msg, index) => (
               <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                 
                 {msg.role === 'user' ? (
                   <div className="flex justify-end">
                     <div className="bg-[#282A2D] text-[#E3E3E3] px-4 md:px-6 py-2.5 md:py-3.5 rounded-2xl md:rounded-3xl rounded-br-sm max-w-[90%] md:max-w-[85%] text-[14px] md:text-[15px] leading-relaxed shadow-sm">
                       {msg.content}
                     </div>
                   </div>
                 ) : (
                   <div className="flex gap-3 md:gap-5 max-w-full md:max-w-4xl pr-2 md:pr-12">
                     <div className="mt-1 shrink-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-linear-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <Sparkles size={12} className="text-white md:w-[14px] md:h-[14px]" />
                        </div>
                     </div>
                     <div className="space-y-3 w-full overflow-hidden">
                        <div className="text-gray-200 text-[14px] md:text-[15px] leading-6 md:leading-7 font-light tracking-wide break-words">
                            {msg.content}
                        </div>
                        
                        {msg.logs && msg.logs.length > 0 && (
                            <div className="pt-1">
                                <ThoughtProcess logs={msg.logs} />
                            </div>
                        )}
                     </div>
                   </div>
                 )}
               </div>
             ))}
             
             {isLoading && (
               <div className="flex gap-3 md:gap-5">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-transparent flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                  <div className="h-7 md:h-8 flex items-center">
                      <span className="text-[10px] md:text-xs font-medium text-gray-500 animate-pulse">Thinking...</span>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-linear-to-t from-[#131314] via-[#131314] to-transparent pb-4 md:pb-8 pt-12 px-4 z-30">
        <div className="max-w-3xl mx-auto relative group">
           <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
           
           <div className="relative bg-[#1E1F20] rounded-full flex items-center p-1.5 md:p-2 shadow-2xl border border-white/5 focus-within:border-gray-600 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Message Jarvis..."
                className="flex-1 bg-transparent border-none outline-none text-gray-100 px-4 md:px-6 py-2.5 md:py-3 placeholder-gray-500 text-[14px] md:text-[15px]"
                autoFocus
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-2.5 md:p-3 rounded-full bg-white text-black hover:bg-gray-200 disabled:bg-[#2D2E30] disabled:text-gray-500 transition-all duration-200 shrink-0"
              >
                {isLoading ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <ArrowUp size={18} className="md:w-5 md:h-5" />}
              </button>
           </div>
           
           <div className="flex flex-col items-center gap-1 mt-4">
              <p className="text-center text-[10px] md:text-[11px] text-gray-500 font-medium tracking-wide">
                Powered by Groq, Llama 3 & Pinecone
              </p>
              <footer className="text-[10px] md:text-[11px] text-gray-600 font-medium">
                Built with ❤️ by dhruval
              </footer>
           </div>
        </div>
      </div>

    </div>
  );
};

const ThoughtProcess = ({ logs }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2 bg-[#1A1B1E] rounded-lg border border-white/5 overflow-hidden w-full md:w-fit md:max-w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-gray-400 hover:text-blue-400 hover:bg-white/5 transition-all px-3 md:px-4 py-2 w-full text-left"
      >
        <Terminal size={10} className="md:w-3 md:h-3" />
        {isOpen ? 'Hide neural process' : 'View thought process'}
        {isOpen ? <ChevronUp size={10} className="ml-auto opacity-50 md:w-3 md:h-3"/> : <ChevronDown size={10} className="ml-auto opacity-50 md:w-3 md:h-3"/>}
      </button>

      {isOpen && (
        <div className="px-3 md:px-4 py-2.5 md:py-3 bg-black/20 border-t border-white/5 space-y-1.5 md:space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 md:gap-3 text-[9px] md:text-[11px] font-mono leading-relaxed">
               <span className={`uppercase tracking-wider w-12 md:w-16 shrink-0 ${
                   log.step === 'Decision' ? 'text-blue-400' :
                   log.step === 'Memory' ? 'text-purple-400' :
                   'text-gray-500'
               }`}>
                 {log.step}
               </span>
               <span className="text-gray-300 opacity-80 break-words flex-1">{log.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;