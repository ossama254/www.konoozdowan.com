import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStore } from '../context/StoreContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { lang } = useStore();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-4 start-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1F2937] text-amber-50 text-xs font-medium shadow-lg border border-amber-500/30"
    >
      <WifiOff className="w-4 h-4 text-[#D97706] shrink-0" />
      <span>
        {lang === 'ar'
          ? 'أنت تتصفح بدون إنترنت — يتم عرض البيانات المحفوظة'
          : 'You are offline — showing cached store data'}
      </span>
    </div>
  );
};
