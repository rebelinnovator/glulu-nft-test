import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { isMobileDevice, formatMobileError, getWalletInstructions } from '../mobileWalletConfig';

export const useMobileWallet = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Check if user is on mobile
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (error) {
      const formattedError = formatMobileError(error.message);
      setConnectionError(formattedError);
      
      // Clear error after 8 seconds on mobile (longer for better UX)
      const timer = setTimeout(() => {
        setConnectionError(null);
      }, isMobile ? 8000 : 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, isMobile]);

  const connectWallet = async (connectorId: string) => {
    try {
      setConnectionError(null);
      setIsConnecting(true);
      
      const connector = connectors.find(c => c.id === connectorId);
      
      if (connector) {
        // Add timeout for mobile connections
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 30000);
        });
        
        const connectPromise = connect({ connector });
        
        await Promise.race([connectPromise, timeoutPromise]);
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      const errorMessage = err.message || 'Failed to connect wallet';
      setConnectionError(formatMobileError(errorMessage));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    try {
      disconnect();
      setConnectionError(null);
    } catch (err) {
      console.error('Wallet disconnection error:', err);
    }
  };

  const getConnectionInstructions = (walletName: string) => {
    return getWalletInstructions(walletName);
  };

  return {
    isMobile,
    isConnected,
    address,
    isPending: isPending || isConnecting,
    connectionError,
    connectWallet,
    disconnectWallet,
    connectors,
    getConnectionInstructions,
  };
}; 