import React from 'react';
import Link from 'next/link';

const footerLinks = [
  { label: '關於我們', href: '/about' },
  { label: '常見問題', href: '/faq' },
  { label: '聯絡我們', href: '/contact' },
  { label: '成為美容師', href: '/become-groomer' },
  { label: '寵物美容服務', href: '/pet-services' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-blue-600">
            PetGroom
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PetGroom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
