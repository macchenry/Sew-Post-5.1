import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: string; // ISO date string
}

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  // Don't render anything if the timer has reached 0
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="flex items-center justify-center gap-2 text-stone-500 font-medium tracking-widest uppercase text-sm mt-4">
        <Clock className="w-4 h-4" />
        Voting has ended
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex items-center gap-2 text-stone-500 font-medium tracking-widest uppercase text-sm mb-4">
        <Clock className="w-4 h-4" />
        Time Remaining
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="bg-stone-900 text-stone-50 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-serif font-bold shadow-sm">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-widest mt-2">Days</span>
        </div>
        <div className="text-2xl font-serif font-bold text-stone-300 pb-6">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-stone-900 text-stone-50 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-serif font-bold shadow-sm">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-widest mt-2">Hours</span>
        </div>
        <div className="text-2xl font-serif font-bold text-stone-300 pb-6">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-stone-900 text-stone-50 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-serif font-bold shadow-sm">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-widest mt-2">Mins</span>
        </div>
        <div className="text-2xl font-serif font-bold text-stone-300 pb-6">:</div>
        <div className="flex flex-col items-center">
          <div className="bg-stone-900 text-stone-50 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-serif font-bold shadow-sm">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-widest mt-2">Secs</span>
        </div>
      </div>
    </div>
  );
}
