import dayjs from 'dayjs';
import type { ResourceType } from '@/types';

/**
 * Format a price as "NT$ 1,200"
 */
export function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString('en-US')}`;
}

/**
 * Format a date string as "2024/01/15"
 */
export function formatDate(dateStr: string): string {
  return dayjs(dateStr).format('YYYY/MM/DD');
}

/**
 * Format a date string as time "14:30"
 */
export function formatTime(dateStr: string): string {
  return dayjs(dateStr).format('HH:mm');
}

/**
 * Format a date string as "2024/01/15 14:30"
 */
export function formatDateTime(dateStr: string): string {
  return dayjs(dateStr).format('YYYY/MM/DD HH:mm');
}

/**
 * Format duration in minutes as "1 小時 30 分" or "60 分鐘"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours} 小時 ${mins} 分`;
  }
  if (hours > 0) {
    return `${hours} 小時`;
  }
  return `${minutes} 分鐘`;
}

/**
 * Format a rating number as "4.5"
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Returns Chinese label for booking/groomer statuses.
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Booking statuses
    pending: '待確認',
    confirmed: '已確認',
    completed: '已完成',
    cancelled: '已取消',
    no_show: '未到場',
    // Groomer statuses
    approved: '已核准',
    suspended: '已停權',
    // Payment statuses
    unpaid: '未付款',
    paid: '已付款',
    refunded: '已退款',
  };

  return labels[status] ?? status;
}

/**
 * Returns a Tailwind color class string for a given status.
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Booking statuses
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-[#4884B8] bg-[#DBEAF5]',
    completed: 'text-green-600 bg-green-50',
    cancelled: 'text-gray-600 bg-gray-50',
    no_show: 'text-red-600 bg-red-50',
    // Groomer statuses
    approved: 'text-green-600 bg-green-50',
    suspended: 'text-red-600 bg-red-50',
    // Payment statuses
    unpaid: 'text-yellow-600 bg-yellow-50',
    paid: 'text-green-600 bg-green-50',
    refunded: 'text-orange-600 bg-orange-50',
  };

  return colors[status] ?? 'text-gray-600 bg-gray-50';
}

/**
 * Returns Chinese label specifically for payment statuses.
 */
export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    unpaid: '未付款',
    paid: '已付款',
    refunded: '已退款',
  };

  return labels[status] ?? status;
}

/**
 * Returns Chinese label for a resource type (pet grooming equipment only).
 */
export function getResourceTypeLabel(type: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    groom_table: '美容桌',
    bath: '洗澡槽',
    dryer: '烘乾機',
  };

  return labels[type] ?? type;
}
