'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { getCurrentUser } from '@/lib/auth';
import { getBookings, getGroomer, getService } from '@/lib/api';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { User, Booking } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [nextBookingGroomerName, setNextBookingGroomerName] = useState('');
  const [nextBookingSvcName, setNextBookingSvcName] = useState('');
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked || !user) return;

    async function loadBookings() {
      try {
        setLoading(true);
        const bookings = await getBookings({ customerEmail: user!.email });
        // Find next upcoming booking
        const now = new Date().toISOString();
        const upcoming = bookings
          .filter(
            (b) =>
              (b.status === 'confirmed' || b.status === 'pending') &&
              b.startAt > now,
          )
          .sort((a, b) => a.startAt.localeCompare(b.startAt));

        if (upcoming.length > 0) {
          const next = upcoming[0];
          setNextBooking(next);

          const [groomer, svc] = await Promise.all([
            getGroomer(next.groomerId),
            getService(next.serviceId),
          ]);
          setNextBookingGroomerName(groomer?.displayName ?? '');
          setNextBookingSvcName(svc?.name ?? '');
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [authChecked, user]);

  if (!authChecked) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton variant="rect" height={200} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          歡迎回來，{user?.name}
        </h1>
        <p className="mt-1 text-gray-500">管理你的帳號與預約</p>
      </div>

      {/* Next Upcoming Booking */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          下一筆預約
        </h2>
        {loading ? (
          <Skeleton variant="rect" height={120} />
        ) : nextBooking ? (
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {nextBookingSvcName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  美容師：{nextBookingGroomerName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  時間：{formatDateTime(nextBooking.startAt)}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatPrice(nextBooking.price)}
                </p>
              </div>
              <Link href={`/account/bookings/${nextBooking.id}`}>
                <Button variant="outline" size="sm">
                  查看詳情
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <p className="py-4 text-center text-sm text-gray-500">
              目前沒有即將到來的預約
            </p>
          </Card>
        )}
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速連結</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/account/bookings">
            <Card hover>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#DBEAF5]">
                  <svg
                    className="h-6 w-6 text-[#4884B8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    我的預約
                  </h3>
                  <p className="text-sm text-gray-500">
                    查看所有預約記錄
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/account/reviews">
            <Card hover>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    我的評價
                  </h3>
                  <p className="text-sm text-gray-500">
                    查看已留下的評價
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
