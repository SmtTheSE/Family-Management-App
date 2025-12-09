import { Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Family Management</h3>
            <p className="text-gray-600">
              An application to help you better organize and manage your family life
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <Heart size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('home');
                  }} 
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  အိမ်မှတ်စုများ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('recipes');
                  }} 
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  ချက်ပြုတ်နည်းများ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate && onNavigate('shopping');
                  }} 
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  စျေးဝယ်စာရင်း
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li><a href="mailto:sittminthar005@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Feedback</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">HCM</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">+95 0898808753</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">sittminthar005@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            &copy; 2025 Family Management. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 text-gray-500 text-sm">
            Developed by Sitt Min Thar with love ❤️
          </div>
        </div>
      </div>
    </footer>
  );
}