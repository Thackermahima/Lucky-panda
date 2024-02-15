import React, { createContext, useEffect, useState } from "react";
// import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
const ethers = require("ethers") 
export const Web3Context = createContext(undefined);

export const Web3ContextProvider = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState();
  const [update, setUpdate] = useState(false);
  const [aLoading, setaLoading] = useState(false);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  let add = localStorage.getItem("address");

  useEffect(() => {
    const initialize = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
    };

    if (add) {
      initialize();
    }
  }, [add]);

  

 

  const connectWallet = async () => {
    const { ethereum } = window;
    setaLoading(true);

    if (!ethereum) {
      alert("Please install the Metamask Extension!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      window.localStorage.setItem("address", accounts[0]);
      setUpdate(!update);
      setaLoading(false);
    } catch (err) {
      setaLoading(false);
      if (err.code === 4902) {
        try {
          setaLoading(true);
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setAddress(accounts[0]);
          window.localStorage.setItem("address", accounts[0]);
          setUpdate(!update);
          setaLoading(false);
        } catch (err) {
          setaLoading(false);
          toast.error(err.message);
        }
      }
    }
  };


  const disconnectWallet = () => {
    navigate("/");
    window.localStorage.removeItem("address");
    setUpdate(!update);
    window.location.reload();
  };

  const shortAddress = (addr) =>
    addr.length > 10 && addr.startsWith("0x")
      ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
      : addr;



  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        shortAddress,
        disconnectWallet,
        setUpdate,
        address,
        update,
        aLoading,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};