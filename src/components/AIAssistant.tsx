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