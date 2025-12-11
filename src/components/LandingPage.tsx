import { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Home, ChefHat, ShoppingCart, FileText, Users, LogIn, UserPlus } from 'lucide-react';

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

  // Scroll to auth form
  const scrollToAuth = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setTimeout(() => {
      const element = document.getElementById('auth-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
      icon: FileText,
      title: 'မှတ်စု & ဆက်သွယ်ရန်',
      description: 'Organize important notes and contacts in one place. Categorize and search easily.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Navigation */}
      <header className="absolute inset-x-0 top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo size="sm" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Family Manager</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
              <a href="#developer" className="text-gray-700 hover:text-gray-900 transition-colors">Developer</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => scrollToAuth(true)}
                className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/30 transition-all duration-200 ease-apple text-sm font-medium"
              >
                <LogIn className="inline mr-1 h-4 w-4" />
                Sign In
              </button>
              <button 
                onClick={() => scrollToAuth(false)}
                className="px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm text-white hover:bg-black border border-white/20 transition-all duration-200 ease-apple text-sm font-medium"
              >
                <UserPlus className="inline mr-1 h-4 w-4" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-visible pt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900">
                    <span className="block">Manage Your Family</span>
                    <span className="block text-gray-800 mt-2">Like Never Before</span>
                  </h1>
                  <p className="mt-3 text-base sm:text-lg md:text-xl lg:text-xl text-gray-500 sm:mt-5 md:mt-5">
                    The ultimate family management solution. Organize your home, recipes, shopping lists, expenses, notes & contacts - all in one beautifully designed app.
                  </p>
                  <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
                    <div className="rounded-md shadow">
                      <a
                        href="#features"
                        className="w-full flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border border-transparent text-base font-medium rounded-xl text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition-all duration-300 ease-apple backdrop-blur-sm"
                      >
                        Learn More
                      </a>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="w-full flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border border-gray-300 text-base font-medium rounded-xl text-gray-800 bg-white/50 hover:bg-white/80 md:py-4 md:text-lg md:px-10 transition-all duration-300 ease-apple backdrop-blur-sm"
                      >
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              </main>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/family-high-quality.jpg" 
                alt="Family Management" 
                className="rounded-2xl shadow-2xl w-full max-w-lg object-cover h-auto"
              />
            </div>
          </div>
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
                  <div key={index} className="relative group">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gray-900 text-white group-hover:bg-black transition-colors duration-300">
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

      {/* Notes & Contacts Preview */}
      <div className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">မှတ်စု & ဆက်သွယ်ရန်</h2>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 lg:mx-auto">
              Organize your notes and contacts in one convenient place
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Notes Preview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/50">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">မှတ်စုများ</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between">
                    <h4 className="font-medium">ဆေးညွှန်း မှတ်စု</h4>
                    <span className="text-xs text-gray-500">2 နာရီအကြာ</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">ဆရာဝန်နှင့် တွေ့ဆုံမည့် နေ့ရက် သတိရ ပေးရန်</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">ကျန်းမာရေး</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">အရေးကြီး</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between">
                    <h4 className="font-medium">စျေးဝယ်စာရင်း</h4>
                    <span className="text-xs text-gray-500">မနေ့က</span>
                  </div>
                  <ul className="text-gray-600 text-sm mt-2 list-disc pl-5 space-y-1">
                    <li>နို့</li>
                    <li>ဥ</li>
                    <li>ပဲစပါး</li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">စျေးဝယ်</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/30 transition-all duration-200 ease-apple font-medium">
                  မှတ်စုများကို ကြည့်ရန်
                </button>
              </div>
            </div>
            
            {/* Contacts Preview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/50">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">ဆက်သွယ်ရန်များ</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Users className="text-blue-600 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">ဆရာဝန်မောင်မောင်</h4>
                    <p className="text-gray-600 text-sm">ကျန်းမာရေး</p>
                    <p className="text-gray-500 text-xs">၀၉၁၂၃၄၅၆၇၈</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/30 transition-all duration-200 ease-apple text-sm font-medium">
                    ခေါ်မည်
                  </button>
                </div>
                
                <div className="flex items-center border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Users className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">မောင်မောင်</h4>
                    <p className="text-gray-600 text-sm">မိသားစု</p>
                    <p className="text-gray-500 text-xs">၀၉၈၇၆၅၄၃၂၁</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/30 transition-all duration-200 ease-apple text-sm font-medium">
                    စာပို့မည်
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full px-4 py-3 rounded-xl bg-black/80 backdrop-blur-sm text-white hover:bg-black border border-white/20 transition-all duration-200 ease-apple font-medium">
                  ဆက်သွယ်ရန်များကို ကြည့်ရန်
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div id="developer" className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/50 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Sitt Min Thar</h2>
            <p className="text-lg text-gray-600 mb-2">Full Stack Developer</p>
            <p className="text-gray-700 mb-8">
              A passionate developer focused on creating intuitive and efficient web applications. 
              With expertise in modern web technologies, I strive to build applications that provide 
              exceptional user experiences while maintaining clean, maintainable code.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://sittmintharportfolio.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors duration-200"
              >
                View Portfolio
              </a>
              <a 
                href="mailto:sittminthar005@gmail.com" 
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div id="auth-section" className="py-12 bg-gradient-to-br from-gray-50 to-white">
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
            
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto border border-white/50">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50/80 text-red-600 p-3 rounded-xl text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-black/80 backdrop-blur-sm text-white hover:bg-black border border-white/20 transition-all duration-200 ease-apple font-medium flex items-center justify-center"
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