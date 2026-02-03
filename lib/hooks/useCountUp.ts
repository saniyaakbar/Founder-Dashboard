import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
}

/**
 * Hook to animate a number from 0 to the target value on mount.
 * Uses requestAnimationFrame for smooth animation.
 * Animates once per component mount/remount.
 */
export function useCountUp({
  end,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
}: UseCountUpOptions): string {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple animations from running simultaneously
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * end;

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end exactly at target
        isAnimatingRef.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, [end, duration]);

  // Format the number
  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    
    // Add thousand separators
    if (separator) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    const formatted = parts.join('.');
    return `${prefix}${formatted}${suffix}`;
  };

  return formatNumber(count);
}
