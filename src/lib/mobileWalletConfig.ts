// Mobile wallet configuration and troubleshooting
export const MOBILE_WALLET_CONFIG = {
  // Supported mobile wallets
  supportedWallets: [
    'rainbow',
    'metamask',
    'walletconnect',
    'coinbase',
    'trust',
    'binance',
  ],
  
  // Mobile-specific connection settings
  connectionSettings: {
    timeout: 30000, // 30 seconds timeout
    retryAttempts: 3,
    retryDelay: 2000, // 2 seconds between retries
  },
  
  // Common mobile wallet issues and solutions
  troubleshooting: {
    'User rejected request': 'Please approve the connection in your wallet app',
    'User rejected the request': 'Please approve the connection in your wallet app',
    'User rejected transaction': 'Please approve the transaction in your wallet app',
    'No provider was set': 'Please install a wallet app like Rainbow or MetaMask',
    'User closed modal': 'Please try connecting again',
    'Connection timeout': 'Please check your internet connection and try again',
    'Wallet not found': 'Please install the wallet app or try a different wallet',
  },
  
  // Mobile detection patterns
  mobilePatterns: [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ],
};

// Helper function to detect mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return MOBILE_WALLET_CONFIG.mobilePatterns.some(pattern => pattern.test(userAgent));
};

// Helper function to get wallet-specific instructions
export const getWalletInstructions = (walletName: string): string => {
  const instructions: Record<string, string> = {
    rainbow: 'Open Rainbow app and approve the connection',
    metamask: 'Open MetaMask app and approve the connection',
    walletconnect: 'Scan the QR code with your wallet app',
    coinbase: 'Open Coinbase Wallet app and approve the connection',
    trust: 'Open Trust Wallet app and approve the connection',
    binance: 'Open Binance Wallet app and approve the connection',
  };
  
  return instructions[walletName.toLowerCase()] || 'Please approve the connection in your wallet app';
};

// Helper function to format error messages for mobile
export const formatMobileError = (error: string): string => {
  const troubleshooting = MOBILE_WALLET_CONFIG.troubleshooting;
  
  for (const [key, value] of Object.entries(troubleshooting)) {
    if (error.includes(key)) {
      return value;
    }
  }
  
  return error;
}; 