import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home, ChefHat, ShoppingCart, MessageSquare, LogOut, Menu, X, Wallet } from 'lucide-react';
import { HomeNotes } from './HomeNotes';
import { Recipes } from './Recipes';
import { ShoppingLists } from './ShoppingLists';
import { AIAssistant } from './AIAssistant';
import { ExpenseTracker } from './ExpenseTracker';
import { Logo } from './Logo';
import { Footer } from './Footer';

type TabType = 'home' | 'recipes' | 'shopping' | 'assistant' | 'expenses';

export function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut, signOutAllDevices } = useAuth();
  const [showSignOutOptions, setShowSignOutOptions] = useState(false);

  const tabs = [
    { id: 'home' as TabType, label: 'အိမ်စီမံခန့်ခွဲမှု', icon: Home },
    { id: 'recipes' as TabType, label: 'ချက်ပြုတ်နည်းများ', icon: ChefHat },
    { id: 'shopping' as TabType, label: 'စျေးဝယ်စာရင်း', icon: ShoppingCart },
    { id: 'expenses' as TabType, label: 'စာရင်းကုန်ကျမှုများ', icon: Wallet },
    { id: 'assistant' as TabType, label: 'AI အကူအညီ', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeNotes />;
      case 'recipes':
        return <Recipes />;
      case 'shopping':
        return <ShoppingLists />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'assistant':
        return <AIAssistant />;
      default:
        return <HomeNotes />;
    }
  };

  // Close mobile menu when tab changes
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Enhanced Apple-inspired navigation bar with modern tabular style */}
      <nav className="bg-white/80 border-b border-gray-200/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Logo size="sm" className="logo-sm" />
              <h1 className="header-title font-bold text-gray-900">
                မိသားစု စီမံခန့်ခွဲမှု
              </h1>
            </div>

            {/* Desktop Navigation - Modern Tabular Style */}
            <div className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ease-apple mobile-nav-button ${
                      activeTab === tab.id
                        ? 'nav-link-active'
                        : 'nav-link-inactive'
                    }`}
                  >
                    <Icon size={16} className="sm:size-18" />
                    <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowSignOutOptions(!showSignOutOptions)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gradient-to-r from-red-50 to-red-100 hover:text-red-600 transition-all duration-200 ease-apple"
                >
                  <LogOut size={18} />
                  <span>ထွက်မည်</span>
                </button>
                
                {showSignOutOptions && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        signOut();
                        setShowSignOutOptions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-150 text-base"
                    >
                      ထွက်မည် (ဤစက်မှ)
                    </button>
                    <button
                      onClick={() => {
                        signOutAllDevices();
                        setShowSignOutOptions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 text-base"
                    >
                      အားလုံးစက်မှ ထွက်မည်
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center rounded-lg w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 transition-all duration-200 ease-apple shadow-sm"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} className="sm:size-24" /> : <Menu size={20} className="sm:size-24" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden py-2 sm:py-3 space-y-1 border-t border-gray-100 rounded-b-xl bg-gradient-to-r from-gray-50 to-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-3 w-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg transition-all duration-200 ease-apple justify-start ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} className="sm:size-20" />
                    <span className="font-medium text-base sm:text-lg">{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-4 rounded-lg text-gray-600 hover:bg-gradient-to-r from-red-50 to-red-100 hover:text-red-600 transition-all duration-200 ease-apple justify-start"
              >
                <LogOut size={20} />
                <span className="font-medium text-base">ထွက်မည် (ဤစက်မှ)</span>
              </button>
              <button
                onClick={() => {
                  signOutAllDevices();
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-4 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 ease-apple justify-start"
              >
                <LogOut size={20} />
                <span className="font-medium text-base">အားလုံးစက်မှ ထွက်မည်</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="slide-up">
          {renderContent()}
        </div>
      </main>

      {/* Apple-inspired footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab as TabType)} />
    </div>
  );
}