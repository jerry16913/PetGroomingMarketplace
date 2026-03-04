'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth';
import type { User } from '@/types';

interface NavLink {
  label: string;
  href: string;
}

/* Center nav links per role */
const guestNavLinks: NavLink[] = [
  { label: '找美容師', href: '/groomers' },
  { label: '找服務', href: '/pet-services' },
];

const customerNavLinks: NavLink[] = [
  { label: '找美容師', href: '/groomers' },
  { label: '找服務', href: '/pet-services' },
  { label: '我的預約', href: '/account/bookings' },
];

const groomerNavLinks: NavLink[] = [
  { label: '儀表板', href: '/pro/dashboard' },
  { label: '訂單', href: '/pro/bookings' },
  { label: '收入', href: '/pro/earnings' },
  { label: '設定', href: '/pro/settings' },
];

const adminNavLinks: NavLink[] = [
  { label: '儀表板', href: '/admin/dashboard' },
  { label: '美容師管理', href: '/admin/professionals' },
  { label: '訂單', href: '/admin/bookings' },
  { label: '目錄', href: '/admin/catalog/services' },
  { label: '資源', href: '/admin/resources' },
];

function getNavLinks(role: string | null): NavLink[] {
  switch (role) {
    case 'customer':
      return customerNavLinks;
    case 'groomer':
      return groomerNavLinks;
    case 'admin':
      return adminNavLinks;
    default:
      return guestNavLinks;
  }
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = getNavLinks(user?.role ?? null);
  const isGuest = !user;

  function handleLogout() {
    logout();
    setUser(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push('/groomers');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/95 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Left — Logo */}
          <a href="https://pawpawspace.com" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.svg" alt="Paw Paw" width={36} height={36} className="rounded-lg" />
            <span className="hidden sm:inline">
              <span className="text-[#4884B8] font-semibold">Paw Paw</span>
              <span className="ml-1.5 text-gray-500 font-medium">泡泡</span>
            </span>
          </a>

          {/* Center — Nav links (desktop) */}
          <div className="hidden md:flex md:items-center md:justify-center md:gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 font-medium transition-colors hover:text-[#4884B8] hover:bg-[#DBEAF5]/50 ${
                  isGuest ? 'text-base text-gray-800' : 'text-sm text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Login button or user dropdown */}
          <div className="hidden md:flex md:items-center md:gap-3 shrink-0">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DBEAF5] text-sm font-semibold text-[#4884B8]">
                    {user.name.charAt(0)}
                  </span>
                  <span>{user.name}</span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === 'customer' && (
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        帳號設定
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      登出
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-lg bg-[#4884B8] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3D77AB] active:bg-[#366A9A] transition-colors"
              >
                登入
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="my-2 border-t border-gray-100" />
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DBEAF5] text-sm font-semibold text-[#4884B8]">
                    {user.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                {user.role === 'customer' && (
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    帳號設定
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  登出
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-gray-100" />
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg bg-[#4884B8] px-3 py-2.5 text-center text-base font-medium text-white hover:bg-[#3D77AB] transition-colors"
                >
                  登入
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
