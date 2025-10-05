/**
 * Utility functions for managing fixed-rate data and localStorage operations
 */

interface FixedRateData {
  rateId: string;
  validUntil: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  timestamp: number;
}

const RATE_STORAGE_KEY = 'blockhaven_fixed_rate_data';

/**
 * Store fixed rate data in localStorage
 */
export function storeFixedRateData(data: {
  rateId: string;
  validUntil: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
}): void {
  try {
    const rateData: FixedRateData = {
      ...data,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(rateData));
  } catch (error) {
    console.error('Error storing fixed rate data:', error);
  }
}

/**
 * Get fixed rate data from localStorage
 */
export function getFixedRateData(): FixedRateData | null {
  try {
    const stored = localStorage.getItem(RATE_STORAGE_KEY);
    if (!stored) return null;
    
    const data: FixedRateData = JSON.parse(stored);
    
    // Check if the rate is still valid
    const validUntilTime = new Date(data.validUntil).getTime();
    const currentTime = Date.now();
    
    if (currentTime >= validUntilTime) {
      // Rate has expired, remove it
      clearFixedRateData();
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting fixed rate data:', error);
    return null;
  }
}

/**
 * Clear fixed rate data from localStorage
 */
export function clearFixedRateData(): void {
  try {
    localStorage.removeItem(RATE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing fixed rate data:', error);
  }
}

/**
 * Check if stored rate data matches current exchange parameters
 */
export function isRateDataValid(
  fromCurrency: string,
  toCurrency: string,
  fromAmount: string,
  toAmount: string
): boolean {
  const storedData = getFixedRateData();
  
  if (!storedData) return false;
  
  return (
    storedData.fromCurrency === fromCurrency &&
    storedData.toCurrency === toCurrency &&
    storedData.fromAmount === fromAmount &&
    storedData.toAmount === toAmount
  );
}

/**
 * Calculate time remaining until rate expires
 */
export function getTimeRemaining(validUntil: string): {
  totalSeconds: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
} {
  const validUntilTime = new Date(validUntil).getTime();
  const currentTime = Date.now();
  const timeDiff = validUntilTime - currentTime;
  
  if (timeDiff <= 0) {
    return {
      totalSeconds: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: '00:00',
    };
  }
  
  const totalSeconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return {
    totalSeconds,
    minutes,
    seconds,
    isExpired: false,
    formatted,
  };
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(validUntil: string): string {
  const timeData = getTimeRemaining(validUntil);
  
  if (timeData.isExpired) {
    return 'Rate expired';
  }
  
  if (timeData.totalSeconds < 60) {
    return `${timeData.seconds}s remaining`;
  }
  
  return `${timeData.formatted} remaining`;
}

/**
 * Check if rate is about to expire (less than 2 minutes)
 */
export function isRateAboutToExpire(validUntil: string): boolean {
  const timeData = getTimeRemaining(validUntil);
  return !timeData.isExpired && timeData.totalSeconds < 120; // Less than 2 minutes
}

/**
 * Check if rate is critically low (less than 30 seconds)
 */
export function isRateCriticallyLow(validUntil: string): boolean {
  const timeData = getTimeRemaining(validUntil);
  return !timeData.isExpired && timeData.totalSeconds < 30; // Less than 30 seconds
}