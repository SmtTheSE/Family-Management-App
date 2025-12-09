import { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Home, ChefHat, ShoppingCart, MessageSquare } from 'lucide-react';

export function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Features data
  const features = [
    {
      icon: Home,
      title: 'အိမ်စီမံခန့်ခွဲမှု',
      description: 'Create and manage notes for everything at home. Categorize notes and collaborate with family members.'
    },
    {
      icon: ChefHat,
      title: 'ချက်ပြုတ်နည်းများ',
      description: 'Add recipes from different cuisines. Track prep time, cook time, and servings with detailed instructions.'
    },
    {
      icon: ShoppingCart,
      title: 'စျေးဝယ်စာရင်း',
      description: 'Create weekly shopping lists, add items with quantities, and check off items as you shop.'
    },
    {
      icon: Wallet,
      title: 'စာရင်းကုန်ကျမှုများ',
      description: 'Track your family expenses, categorize spending, and gain insights into your financial habits.'
    },
    {
      icon: MessageSquare,
      title: 'AI အကူအညီ',
      description: 'Get AI-powered assistance with Myanmar language support. Ask questions about home management, recipes, and more.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900">
                  <span className="block">Manage Your Family</span>
                  <span className="block text-gray-800 mt-2">Like Never Before</span>
                </h1>
                <p className="mt-3 text-base sm:text-lg md:text-xl lg:text-xl text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The ultimate family management solution. Organize your home, recipes, shopping lists, expenses, and get AI-powered assistance - all in one beautifully designed app.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#features"
                      className="w-full flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-black md:py-4 md:text-lg md:px-10 transition-all duration-300 ease-apple"
                    >
                      Learn More
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border border-transparent text-base font-medium rounded-md text-gray-800 bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10 transition-all duration-300 ease-apple"
                    >
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 hidden lg:block">
          <div className="h-56 w-full bg-gradient-to-r from-gray-300 to-gray-400 sm:h-72 md:h-96 lg:w-full lg:h-full rounded-l-3xl shadow-2xl transform rotate-3 scale-105 opacity-90"></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-gray-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything your family needs
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              A complete solution for managing your household efficiently and effortlessly.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-16">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Tracker Preview */}
      <div className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">စာရင်းကုန်ကျမှုများ</h2>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 lg:mx-auto">
              Track your family expenses with our intuitive expense tracker
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-gray-500 text-sm">Total Expenses</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">125,000 Ks</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-gray-500 text-sm">Categories</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">5</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-gray-500 text-sm">This Month</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">32</div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-5">Description</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-5">
                    <div className="font-medium">Weekly Groceries</div>
                    <div className="text-gray-500 text-xs">Supermarket shopping</div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    Food
                  </div>
                  <div className="col-span-2 text-gray-500">Dec 5</div>
                  <div className="col-span-2 text-right font-medium">42,000 Ks</div>
                </div>
                <div className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-5">
                    <div className="font-medium">Electricity Bill</div>
                    <div className="text-gray-500 text-xs">Monthly utility</div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    Utilities
                  </div>
                  <div className="col-span-2 text-gray-500">Dec 1</div>
                  <div className="col-span-2 text-right font-medium">28,500 Ks</div>
                </div>
                <div className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-5">
                    <div className="font-medium">Dinner Out</div>
                    <div className="text-gray-500 text-xs">Restaurant dinner</div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    Entertainment
                  </div>
                  <div className="col-span-2 text-gray-500">Nov 28</div>
                  <div className="col-span-2 text-right font-medium">18,000 Ks</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="btn-primary px-6 py-3">
                Get Started with Expense Tracking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-10 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 sm:text-4xl">
                <span className="block">Ready to get started?</span>
                <span className="block text-gray-800 mt-2">Join your family today.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Sign up now and experience the future of family management. It's free and takes less than a minute.
              </p>
              <div className="mt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Free forever with no credit card required</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Invite unlimited family members</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">Access to all features</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto apple-card-glass">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Logo size="md" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {isLogin ? 'Sign in to continue to your family dashboard' : 'Join us to manage your family efficiently'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent input-apple"
                      placeholder="Your name"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent input-apple"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent input-apple"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  )}
                </button>
              </form>

              <div className="mt-5 sm:mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-gray-800 hover:underline text-sm sm:text-base transition-colors duration-200"
                >
                  {isLogin
                    ? 'Don\'t have an account? Sign Up'
                    : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}