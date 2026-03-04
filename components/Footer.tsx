import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <a href="https://pawpawspace.com" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Paw Paw" width={32} height={32} className="rounded-lg" />
              <span>
                <span className="text-[#4884B8] font-semibold">Paw Paw</span>
                <span className="ml-1.5 text-gray-500 font-medium">泡泡</span>
              </span>
            </a>
            <p className="text-sm text-gray-400">寵物美容平台</p>
          </div>

          {/* Link to main site */}
          <a
            href="https://pawpawspace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            主網站 →
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Paw Paw 泡泡. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
