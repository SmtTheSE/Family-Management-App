import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  created_at: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadChatHistory();
    checkSpeechSupport();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkSpeechSupport = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'my-MM';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      // Use the new Supabase Edge Function for OpenAI API calls
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-openai`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantResponse = data.response;

      const { data: savedMessage, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          message: userMessage,
          response: assistantResponse,
        })
        .select()
        .single();

      if (!error && savedMessage) {
        setMessages([...messages, savedMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('အမှားတစ်ခု ဖြစ်ပွားခ့ဲသည်။ ထပ်မံကြိုးစားကြည့်ပါ။');
    } finally {
      setLoading(false);
    }
  };

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('စကားဝိုင်းမှတ်တမ်း အားလုံးကို ဖျက်မှာ သေချာပါသလား?')) {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user?.id);

      if (!error) {
        setMessages([]);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="heading-hero text-primary">AI အကူအညီ</h2>
        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="btn-secondary flex items-center space-x-2 text-red-600 hover:bg-red-50 w-full sm:w-auto justify-center"
          >
            <Trash2 size={20} />
            <span>မှတ်တမ်းရှင်းမည်</span>
          </button>
        )}
      </div>

      <div className="apple-card flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-blue-500" size={24} />
              </div>
              <h3 className="heading-section text-primary mb-2">
                မင်္ဂလာပါ! ကျွန်တော် မိသားစုအကူအညီ AI ပါ။
              </h3>
              <p className="body-text text-secondary mb-2 max-w-md mx-auto">
                အိမ်စီမံခန့်ခွဲမှု၊ ချက်ပြုတ်နည်းများ၊ သို့မဟုတ် အခြားမေးခွန်းများအတွက် မေးမြန်းနိုင်ပါသည်။
              </p>
              {speechSupported && (
                <p className="caption-text mt-4 flex items-center justify-center">
                  <Mic className="mr-2 text-blue-500" size={16} />
                  🎤 အသံဖြင့်လည်း မေးမြန်းနိုင်ပါသည်
                </p>
              )}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-6">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%]">
                  <p className="body-text whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-tl-none max-w-[85%]">
                  <p className="body-text whitespace-pre-wrap">{msg.response}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="သင့်မေးခွန်းကို ရိုက်ထည့်ပါ..."
                className="input-apple pr-12"
                disabled={loading}
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={isListening ? handleStopListening : handleStartListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 btn-icon ${
                    isListening
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="btn-primary flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>

          {isListening && (
            <p className="caption-text mt-3 text-center animate-pulse flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              နားထောင်နေပါသည်... ပြောပါ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { BarChart, PieChart, Download, Bell, Filter, Eye } from 'lucide-react';

export function FamilyFinanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const budgetCategories = [
    { id: 1, name: 'Food', allocated: 200000, spent: 150000, color: 'bg-blue-500' },
    { id: 2, name: 'Transport', allocated: 100000, spent: 80000, color: 'bg-green-500' },
    { id: 3, name: 'School Fees', allocated: 500000, spent: 500000, color: 'bg-purple-500' },
    { id: 4, name: 'Healthcare', allocated: 150000, spent: 75000, color: 'bg-red-500' },
    { id: 5, name: 'Entertainment', allocated: 100000, spent: 50000, color: 'bg-yellow-500' },
  ];
  
  const recentTransactions = [
    { id: 1, description: 'Grocery Shopping', amount: -45000, date: '2025-12-08', category: 'Food' },
    { id: 2, description: 'School Fee Payment', amount: -500000, date: '2025-12-05', category: 'School Fees' },
    { id: 3, description: 'Salary Deposit', amount: 800000, date: '2025-12-01', category: 'Income' },
    { id: 4, description: 'Bus Fare', amount: -3000, date: '2025-12-07', category: 'Transport' },
    { id: 5, description: 'Doctor Visit', amount: -25000, date: '2025-12-06', category: 'Healthcare' },
  ];
  
  const upcomingPayments = [
    { id: 1, description: 'Electricity Bill', amount: 75000, dueDate: '2025-12-15' },
    { id: 2, description: 'Internet Subscription', amount: 35000, dueDate: '2025-12-20' },
    { id: 3, description: 'Insurance Premium', amount: 120000, dueDate: '2025-12-25' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="heading-hero text-primary">Family Finance Dashboard</h2>
        <div className="flex space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="apple-card p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Balance</h3>
          <p className="text-2xl font-bold">1,250,000 MMK</p>
        </div>
        <div className="apple-card p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Monthly Income</h3>
          <p className="text-2xl font-bold">800,000 MMK</p>
        </div>
        <div className="apple-card p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Monthly Expenses</h3>
          <p className="text-2xl font-bold">855,000 MMK</p>
        </div>
        <div className="apple-card p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Savings Rate</h3>
          <p className="text-2xl font-bold">-6.9%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending by Category */}
        <div className="apple-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="heading-section">Spending by Category</h3>
            <button className="btn-icon">
              <Eye size={18} />
            </button>
          </div>
          <div className="flex items-center justify-center h-64">
            <PieChart className="text-gray-300" size={80} />
            <div className="absolute text-center">
              <p className="text-2xl font-bold">855,000</p>
              <p className="text-gray-500">MMK</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {budgetCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${category.color} rounded-full mr-3`}></div>
                  <span>{category.name}</span>
                </div>
                <span>{category.spent.toLocaleString()} MMK</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="apple-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="heading-section">Monthly Trend</h3>
            <button className="btn-icon">
              <Eye size={18} />
            </button>
          </div>
          <div className="flex items-center justify-center h-64">
            <BarChart className="text-gray-300" size={80} />
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date} • {transaction.category}</p>
                  </div>
                  <p className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {transaction.amount < 0 ? '-' : '+'}{Math.abs(transaction.amount).toLocaleString()} MMK
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="heading-section">Upcoming Payments</h3>
              <Bell className="text-blue-500" size={20} />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingPayments.map((payment) => (
              <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                  </div>
                  <p className="font-medium text-red-600">{payment.amount.toLocaleString()} MMK</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
