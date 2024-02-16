import React, { useState } from "react";
import './Index.css';
export default function Header() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Placeholder function for connecting the wallet
  // You would replace this with actual web3 connection logic
  const connectWallet = () => {
    // Code to connect to wallet goes here
    // For now, we'll just toggle the state
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <header className="js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors">
    <div className="flex items-center px-6 py-6 xl:px-24 ">
  <nav className="navbar">
        {/* Other navbar content like logo and links go here */}
        <div className="wallet-connection">
          <button className={`wallet-btn ${isWalletConnected ? 'connected' : ''}`} onClick={connectWallet}>
            {isWalletConnected ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </nav>
      </div>
    </header>
  );
}
