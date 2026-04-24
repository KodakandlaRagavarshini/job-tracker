import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { simulateChatResponse } from '../utils/aiSimulator';

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI career assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    const userMsg = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = simulateChatResponse(userMsg);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-primary-500/20 border border-white z-50 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 px-6 flex items-center justify-between shadow-md relative overflow-hidden">
               <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               <div className="flex items-center space-x-3 relative z-10">
                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 shadow-inner backdrop-blur-sm">
                   <Bot className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold tracking-wide flex items-center">HireMate Copilot <Sparkles className="w-3 h-3 ml-1.5 text-yellow-300" /></h3>
                   <p className="text-primary-100 text-[11px] font-medium tracking-wider uppercase">AI Assistant</p>
                 </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full">
                 <X className="w-4 h-4" />
               </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 flex flex-col space-y-4">
               {messages.map((m, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}
                 >
                    <div className={`p-3.5 px-4 rounded-2xl max-w-[85%] text-[14px] shadow-sm leading-relaxed font-medium ${m.isBot ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm' : 'bg-primary-600 text-white rounded-tr-sm shadow-primary-500/20'}`}>
                      {m.text}
                    </div>
                 </motion.div>
               ))}
               {isTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm flex space-x-1.5 shadow-sm">
                     <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-400 rounded-full"></motion.div>
                     <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full"></motion.div>
                     <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full"></motion.div>
                   </div>
                 </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-slate-100">
               <form onSubmit={handleSend} className="relative flex items-center">
                 <input 
                   type="text" 
                   value={input} 
                   onChange={(e) => setInput(e.target.value)}
                   disabled={isTyping}
                   placeholder="Ask me anything..." 
                   className="w-full bg-slate-100/70 border border-slate-200/50 rounded-full pl-5 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-medium placeholder-slate-400 transition-all"
                 />
                 <button 
                    disabled={isTyping || !input.trim()}
                    type="submit" 
                    className={`absolute right-2 w-9 h-9 flex items-center justify-center rounded-full transition-all ${input.trim() && !isTyping ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30 active:scale-95' : 'bg-slate-200 text-slate-400'}`}
                 >
                   <Send className="w-4 h-4 ml-0.5" />
                 </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-50 group border ${isOpen ? 'bg-slate-800 border-slate-700 shadow-slate-900/20' : 'bg-slate-900 border-slate-800 shadow-primary-500/30'}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
        <div className="relative z-10 text-white group-hover:text-white">
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </div>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border-2 border-white"></span>
          </span>
        )}
      </motion.button>
    </>
  );
};

export default AICopilot;
