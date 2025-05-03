"use client"


import Link from "next/link";
import Image from "next/image";

function BaseFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">STARLORD</h2>
            <p className="text-gray-600 mb-6">
              Feature-rich components and beautifully designed UI kit for developers.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              {['About', 'Pricing', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              {['Help and Support', 'Become Instructor', 'Get the app', 'FAQ\'s', 'Tutorial'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in touch</h3>
            <p className="text-gray-600 mb-2">123 Main Street, U.S.A</p>
            <p className="text-gray-600 mb-2">
              Email: <Link href="mailto:support@starlord.com" className="text-indigo-600 hover:text-indigo-800">support@starlord.com</Link>
            </p>
            <p className="text-gray-600 mb-4">
              Phone: <span className="text-gray-800 font-medium">(000) 123 456 789</span>
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="block w-32">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  width={128}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <Link href="#" className="block w-32">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  width={128}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <span className="text-gray-600">© {new Date().getFullYear()} STARLORD</span>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {['Privacy Policy', 'Cookie Notice', 'Terms of Use'].map((item) => (
                  <Link key={item} href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <button 
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Language selector"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                English
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200">
                {[
                  { name: 'English', flag: '🇬🇧' },
                  { name: 'Français', flag: '🇫🇷' },
                  { name: 'Deutsch', flag: '🇩🇪' }
                ].map((lang) => (
                  <Link 
                    key={lang.name} 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BaseFooter;