import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-12 pt-6 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <span 
              className="font-semibold text-[#6F00FF]" 
            >
              Blink Punch
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
