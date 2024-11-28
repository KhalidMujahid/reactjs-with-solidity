import { useState } from "react";
import { ethers } from "ethers";
import depositeABI from "../contracts/Deposite.json";
import { CurrencyDollarIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const contractAddress = "0x";

const Deposite = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]); 
        setStatus("Wallet connected!");
      } catch (err) {
        setStatus("Failed to connect wallet");
      }
    } else {
      setStatus("MetaMask is not installed!");
    }
  };

  const depositFunds = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setStatus("Please enter a valid amount");
      return;
    }

    if (!window.ethereum) {
      setStatus("MetaMask is not installed!");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, depositeABI, signer);

      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount),
      });

      setStatus("Transaction sent! Waiting for confirmation...");

      await tx.wait();

      setStatus("Transaction successful!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Deposit ETH</h2>

        {status && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              status.toLowerCase().includes("error") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {status}
          </div>
        )}

        <div className="mb-4">
          {!walletAddress ? (
            <button
              onClick={connectWallet}
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="text-gray-600 text-sm text-center">
              Connected Wallet: <span className="font-semibold">{walletAddress}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter amount in ETH"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <CurrencyDollarIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={depositFunds}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-green-700 transition flex items-center justify-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <CurrencyDollarIcon className="h-5 w-5" />
            {loading ? "Processing..." : "Deposit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deposite;

