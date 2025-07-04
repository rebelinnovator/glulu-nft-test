"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Wallet, LogOut, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserPoints } from "@/lib/hooks/useUserPoints";
import { useMobileWallet } from "@/lib/hooks/useMobileWallet";

const MOBILE_TROUBLESHOOT_URL = "/MOBILE_WALLET_TROUBLESHOOTING.md";

const Header = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { points, isLoading } = useUserPoints();
  const { isMobile, connectionError } = useMobileWallet();
  const [showError, setShowError] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (isConnected && pathname === "/") {
      router.push("/swap");
    }
  }, [isConnected, router, pathname]);

  useEffect(() => {
    if (connectionError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [connectionError]);

  // Detect if on iOS Safari
  const isIOSSafari = () => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    return /iP(ad|hone|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
  };

  // Show modal if mobile and iOS Safari
  useEffect(() => {
    if (isMobile && isIOSSafari()) {
      setShowMobileModal(true);
    }
  }, [isMobile]);

  const handlePointsClick = () => {
    router.push("/swap");
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  return (
    <>
      {showError && connectionError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{connectionError}</span>
        </div>
      )}
      
      {/* Mobile Wallet Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowMobileModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2 text-red-600">Mobile Wallet Connection Issue</h2>
            <p className="mb-3 text-sm text-gray-700">
              It looks like you're using Safari on iOS. For the best wallet connection experience, please open this site inside your wallet app's built-in browser (e.g., Rainbow, MetaMask, Trust Wallet).
            </p>
            <ul className="mb-3 text-left text-xs text-gray-600 list-disc list-inside">
              <li>Open your wallet app (Rainbow, MetaMask, etc.)</li>
              <li>Find the built-in browser feature</li>
              <li>Navigate to <span className="font-mono bg-gray-100 px-1 rounded">{typeof window !== 'undefined' ? window.location.href : ''}</span></li>
              <li>Connect your wallet from there</li>
            </ul>
            <a
              href={MOBILE_TROUBLESHOOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-xs font-semibold"
            >
              View Full Mobile Troubleshooting Guide
            </a>
          </div>
        </div>
      )}
      
      <div className="z-50 flex items-center justify-between py-2 md:px-6 px-4 bg-gradient-to-r from-[#FFB100] to-[#E29D00] border-2 md:border-4 border-amber-900/80 rounded-lg mt-3 relative max-w-[1450px] mx-auto w-11/12 md:w-full">
        <Image
          src={"/Group 48095938.png"}
          alt=""
          width={100}
          height={50}
          className="absolute top-1/2 -translate-y-1/2 -left-2 w-5 md:w-10 md:-left-7"
        />
        <Image
          src={"/Group 48095938.png"}
          alt=""
          width={100}
          height={50}
          className="absolute top-1/2 -translate-y-1/2 -right-2 w-5 md:w-10 md:-right-7"
        />
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt=""
            width={300}
            height={150}
            className="md:w-52 w-24"
          />
        </Link>
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button
                onClick={handlePointsClick}
                className="bg-[#ffdcaf] hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
              >
                <Image src="/LOGOy2 1.png" alt="" width={20} height={20} />
                {isLoading ? "Loading..." : `${points} Points`}
              </Button>
              <Button
                onClick={handleDisconnect}
                className="bg-[#ffdcaf] lg:ml-5 ml-1 hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Disconnect
              </Button>
            </>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  onClick={openConnectModal}
                  className="bg-[#ffdcaf] mr-5 hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
                >
                  <Wallet className="w-4 h-4 mr-1" />
                  {isMobile ? "Connect Mobile Wallet" : "Connect Wallet"}
                </Button>
              )}
            </ConnectButton.Custom>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
