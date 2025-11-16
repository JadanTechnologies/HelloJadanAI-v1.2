import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { chatWithAI } from '../services/geminiService';
import { CREDIT_COSTS, SparklesIcon } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

interface Message {
    author: 'user' | 'ai';
    text: string;
}

const ChatPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const creditCost = CREDIT_COSTS.chatMessage;
        if (state.credits < creditCost) {
            setError(t('notEnoughCredits'));
            return;
        }
        
        setError('');
        const userMessage: Message = { author: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Deduct credits immediately
            dispatch({ type: 'UPDATE_CREDITS', payload: state.credits - creditCost });
            dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-chat-${Date.now()}`, description: 'AI Chat Message', amount: -creditCost, date: new Date().toISOString() } });

            const aiResponseText = await chatWithAI(input);
            const aiMessage: Message = { author: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setError('An error occurred while getting a response.');
            // Refund credits on error
            dispatch({ type: 'UPDATE_CREDITS', payload: state.credits });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('chatPageTitle')}</h1>
                <p className="text-slate-400 mt-1">{t('chatPageSubtitle')}</p>
            </div>
            
            <Card className="h-[70vh] flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                           <SparklesIcon className="w-16 h-16 mb-4"/>
                           <p>Start a conversation with HelloJadanAI!</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.author === 'user' ? 'flex-row-reverse' : ''}`}>
                             <img src={msg.author === 'user' ? state.user?.avatar : state.brandingSettings.logoUrl || ''} alt="avatar" className="w-8 h-8 rounded-full" />
                             <div className={`p-3 rounded-lg max-w-lg ${msg.author === 'user' ? 'bg-brand-indigo text-white' : 'bg-slate-700 text-slate-200'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <img src={state.brandingSettings.logoUrl || ''} alt="avatar" className="w-8 h-8 rounded-full" />
                            <div className="p-3 rounded-lg bg-slate-700">
                               <div className="flex items-center justify-center space-x-2">
                                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                               </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-slate-700">
                    {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={t('chatPlaceholder')}
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                            disabled={isLoading}
                        />
                        <Button type="submit" isLoading={isLoading} disabled={!input.trim()}>
                            Send
                        </Button>
                    </form>
                    <p className="text-xs text-slate-500 text-center mt-2">Cost: {CREDIT_COSTS.chatMessage} credit per message.</p>
                </div>
            </Card>
        </div>
    );
};

export default ChatPage;
