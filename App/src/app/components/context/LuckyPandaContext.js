import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { json } from '@helia/json';

import {
  MarketplaceContractAddress,
  MarketplaceContractABI,
  NFTContractABI,
  ChainlinkVRFContract,
  ChinlinkVRFAddress
} from '../../constants/abi';
const ethers = require("ethers");

export const LuckyPandaContext = createContext();

export const LuckyPandaContextProvider = (props) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [uploadImg, setUploadedImg] = useState(null);
  const [resultTime, setResultTime] = useState(1);
  const [winnerPercentage, setWinnerPercentage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [AllTokenIds, setAllTokenIds] = useState();
  const [ImgArr, setImgArr] = useState([]);
  const [AllFilesArr, setAllFilesArr] = useState([]);
  const [AllTokenURIs, setAllTokenURIs] = useState([]);
  const [getCollection, setGetCollection] = useState();
  const [collectionUris, setCollectionUris] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [mycollectionUris, setMyCollectionUris] = useState([]);
  const [allCollectionUris, setAllCollectionUris] = useState([]);
  const [helia, setHelia] = useState(null);
  const [fs, setFs] = useState(null);
  const [jsonHandler, setJsonHandler] = useState(null)
  const [nodeId, setNodeId] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const notify = () => toast("NFT Created Successfully !!");

  // Initialize Helia instance on component mount
  useEffect(() => {
    const initHelia = async () => {
      try {
        const heliaNode = await createHelia();
        const fsHandler = unixfs(heliaNode);
        const jsonInstance = json(heliaNode);
        const id = heliaNode.libp2p.peerId.toString();
        setHelia(heliaNode);
        setFs(fsHandler);
        setJsonHandler(jsonInstance); setNodeId(id);
        setIsOnline(heliaNode.libp2p.status === 'started');
      } catch (error) {
        console.error("Failed to initialize Helia:", error);
      }
    };
    initHelia();
  }, []);


  const nameEvent = (e) => setName(e.target.value);
  const symbolEvent = (e) => setSymbol(e.target.value);
  const tokenPriceEvent = (e) => setTokenPrice(e.target.value || null);
  const tokenQuantityEvent = (e) => setTokenQuantity(e.target.value);
  const tokenImgEvent = (e) => setUploadedImg(e.target.files ? e.target.files[0] : null);
  const tokenResultTimeEvent = (e) => setResultTime(e.target.value);
  const tokenWinnerPercentageEvent = (e) => setWinnerPercentage(e.target.value);

  // Function to add data to IPFS using Helia
  const addDataToIPFS = async (content) => {
    try {
      if (!fs || !jsonHandler) throw new Error("IPFS handlers not initialized");

      let cid;
      if (typeof content === "string") {
        // Handle string content
        cid = await fs.addBytes(new TextEncoder().encode(content));
      } else if (content instanceof Blob || content instanceof File) {
        // Handle Blob/File content
        const buffer = await content.arrayBuffer();
        cid = await fs.addBytes(new Uint8Array(buffer));
      } else if (typeof content === "object") {
        // Handle JSON content
        cid = await jsonHandler.add(content);
      } else {
        throw new Error("Unsupported content type");
      }

      return cid.toString();
    } catch (error) {
      console.error("Error adding data to IPFS:", error);
      throw error;
    }
  };


  // Function to handle image upload
  const handleImageUpload = async (imageFile) => {
    try {
      if (!imageFile) throw new Error("No image file provided");
      const cid = await addDataToIPFS(imageFile);
      console.log(cid, "cid");

      return `https://ipfs.io/ipfs/${cid}`;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      toast.error("Failed to upload image");
      return null;
    }
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lotteryContract = new ethers.Contract(
        MarketplaceContractAddress,
        MarketplaceContractABI,
        signer
      );

      let transactionCreate = await lotteryContract.createToken(
        name,
        symbol,
        resultTime * 60,
        winnerPercentage
      );
      let txc = await transactionCreate.wait();
      console.log(txc);

      const metadata = {
        name,
        symbol,
        tokenPrice,
        tokenQuantity,
        resultTime,
        winnerPercentage,
        createdAt: new Date().toISOString(),
      };
      console.log(metadata, "metadata");


      // Add metadata to IPFS
      const metadataCid = await addDataToIPFS(metadata);
      console.log(metadataCid, "metadataCID");

      const uri = `https://ipfs.io/ipfs/${metadataCid}`;
      console.log(uri, "uri");

      notify();

      const setCollectionOfUri = await lotteryContract.setCollectionUri(
        MarketplaceContractAddress,
        uri
      );
      console.log(setCollectionOfUri, "setCollectionUri");

      await setCollectionOfUri.wait();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setName("");
      setTokenPrice("");
      setTokenQuantity("");
      setSymbol("");
      setUploadedImg(null);
      setLoading(false);
    }
  };

  async function getAllCollection() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const MarketpaceContract = new ethers.Contract(
      MarketplaceContractAddress,
      MarketplaceContractABI,
      signer
    );

    const allContractAddresses = await MarketpaceContract.getAllContractAddresses();
    console.log(allContractAddresses, "allContractAddresses");

    const collectionuris = await Promise.all(
      allContractAddresses.map(async (addrs) => {
        const uri = await MarketpaceContract.getCollectionUri(addrs);
        const soldItems = await MarketpaceContract.getAllSoldItems(addrs);
        return { address: addrs, uri: uri, soldItems: soldItems.toString() };
      })
    );
    setCollectionUris(collectionuris);
    setSoldItems(soldItems);
  }

  async function getAllMyCollection() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const MarketpaceContract = new ethers.Contract(
      MarketplaceContractAddress,
      MarketplaceContractABI,
      signer
    );

    try {
      const myCollectionAddresses = await MarketpaceContract.getOwnerContractAddresses();
      const collectionuris = await Promise.all(
        myCollectionAddresses.map(async (addrs) => {
          const uri = await MarketpaceContract.getCollectionUri(addrs);
          return { address: addrs, uri: uri };
        })
      );
      console.log(collectionUris, "colle");

      setMyCollectionUris(collectionuris);
    } catch (error) {
      console.error("Error fetching my collections:", error);
    }
  }

  async function getAllContractCollection() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const MarketpaceContract = new ethers.Contract(
      MarketplaceContractAddress,
      MarketplaceContractABI,
      signer
    );

    const allContractAddresses = await MarketpaceContract.getAllCollectionAddresses();
    console.log(allContractAddresses);

    const allcollectionuris = await Promise.all(
      allContractAddresses.map(async (addrs) => {
        const uri = await MarketpaceContract.getCollectionUri(addrs);
        const [winnerAddress, winningTokenId] = await MarketpaceContract.getCollectionWinner(addrs);
        const hasWinner = winnerAddress !== '0x0000000000000000000000000000000000000000';
        return {
          address: addrs,
          uri: uri,
          hasWinner: hasWinner,
          winnerAddress: winnerAddress,
          winningTokenId: winningTokenId
        }
      })
    );
    setAllCollectionUris(allcollectionuris);
  }

  const Item = {
    name: name,
    symbol: symbol,
    price: tokenPrice,
    quantity: tokenQuantity,
    imgURl: uploadImg,
    resultTime: resultTime,
    winnerPercentage: winnerPercentage,
  };

  return (
    <LuckyPandaContext.Provider
      value={{
        ImgArr,
        AllTokenURIs,
        name,
        nameEvent,
        symbol,
        symbolEvent,
        tokenPrice,
        tokenPriceEvent,
        tokenQuantity,
        tokenQuantityEvent,
        resultTime,
        tokenResultTimeEvent,
        uploadImg,
        tokenImgEvent,
        tokenWinnerPercentageEvent,
        winnerPercentage,
        loading,
        onFormSubmit,
        getCollection,
        AllFilesArr,
        getAllCollection,
        collectionUris,
        getAllMyCollection,
        mycollectionUris,
        getAllContractCollection,
        allCollectionUris,
        handleImageUpload,
        nodeId,
        isOnline
      }}
    >
      {props.children}
    </LuckyPandaContext.Provider>
  );
};
