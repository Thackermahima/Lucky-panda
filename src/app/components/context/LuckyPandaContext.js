import React, { createContext, useState } from "react";
import { create } from "ipfs-http-client";
import { toast } from "react-toastify";
import {
  LotteryEscrowParentContract,
  lotteryEscrowParentABI,
  lotteryEscrowABI
} from '../../constants/abi';
require('dotenv').config();
const ethers = require("ethers") 

export const LuckyPandaContext = createContext();

export const LuckyPandaContextProvider = (props) => {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [tokenPrice, setTokenPrice] = useState("");
    const [tokenQuantity, setTokenQuantity] = useState("");
    const [uploadImg, setUploadedImg] = useState("");
    const [resultTime, setResultTime] = useState(1);
    const [loading, setLoading] = useState(false);
    const [AllTokenIds, setAllTokenIds] = useState();
    const [ImgArr, setImgArr] = useState([]);
    const [AllFilesArr, setAllFilesArr] = useState([]);
    const [AllTokenURIs, setAllTokenURIs] = useState([]);
    const [getCollection, setGetCollection] = useState();
    const [winnerAddress, setWinnerAddress] = useState("");

    const notify = () => toast("NFT Created Successfully !!");

    const nameEvent = (e) => {
      setName(e.target.value);
    };
    const symbolEvent = (e) => {
      setSymbol(e.target.value);
    };
    const tokenPriceEvent = (e) => {
      setTokenPrice(e.target.value || null);
    };
    const tokenQuantityEvent = (e) => {
      setTokenQuantity(e.target.value);
    };
    const tokenImgEvent = (e) => {
      const file = e.target.files[0];
      setUploadedImg(file);
    };  
    const tokenResultTimeEvent = (e) => {
      setResultTime(e.target.value);
    };
    const projectId = process.env.REACT_NEXT_APP_INFURA_PROJECT_KEY;
    const projectSecret = process.env.REACT_NEXT_APP_INFURA_SECRET_KEY;
    const auth =
      "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
    const ifpsConfig = {
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    };
    const ipfs = create(ifpsConfig);
    const addDataToIPFS = async (metadata) => {
      const ipfsHash = await ipfs.add(metadata);
      // console.log(ipfsHash.cid, "IPFSHash cid");
      console.log(ipfsHash.path, "IPFSHash path");
      return ipfsHash.path;
    };
    const handleImageUpload = async (imageFile) => {
      try {
        const imageBuffer = await imageFile.arrayBuffer();
        const ipfsHash = await ipfs.add(imageBuffer);
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash.path}`;
        return ipfsUrl;
      } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        return null;
      }
    };
    const onFormSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
    console.log(Item, "Item");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const lotteryContract = new ethers.Contract(
          LotteryEscrowParentContract,
          lotteryEscrowParentABI,
          signer
        );
    
        let transactionCreate = await lotteryContract.createToken(
          name,
          symbol,
          resultTime * 60
        );
        // let txc = await transactionCreate.wait();
        // if (txc) {
        //   setLoading(false);
        //   console.log(txc, "Successfully created!");
        // }
        // let event = txc.events[0];
        // console.log(event,"event");
        // let tokenContractAddress = event.args[1];    
        let txc = await transactionCreate.wait();
        let tokenContractAddress;
if (txc.status === 1) {
  setLoading(false);
  console.log(txc, "Successfully created!");

  if (txc.logs && txc.logs.length > 0) {
    const logs = txc.logs;
     tokenContractAddress = logs[0].args[1]; // Assuming the contract address is in the args array
    console.log(tokenContractAddress, "Token contract address");
     let userAdd = localStorage.getItem("address");
        localStorage.setItem("tokenContractAddress", tokenContractAddress);
    // Now you can use contractAddress as needed
  } else {
    console.error("No logs found in the transaction receipt.");
  }
} else {
  console.error("Transaction failed.");
}
       
    console.log(tokenPrice,"tokenPrice");
    console.log(ethers.parseUnits(tokenPrice.toString(), "ether"),"tokenPrice");
        let transactionBulkMint = await lotteryContract.bulkMintERC721(
          tokenContractAddress,
          0,
          tokenQuantity,
          ethers.parseUnits(tokenPrice.toString(), "ether")
        );
        let txb = await transactionBulkMint.wait();
        if (txb) {
          console.log("Tokens minted successfully!");
        }
    
        let tokenIds = await lotteryContract.getAllTokenId(tokenContractAddress);
        var imgTokenUrl = await Promise.all(
          tokenIds.map(async (tokenId) => {
            // const imageBuffer = await uploadImg.arrayBuffer();
            console.log(uploadImg,"uploadImg");
            const ipfsHash = await addDataToIPFS(uploadImg);
            console.log(ipfsHash,"ipfsHash");
            const imageUrl = {
              url: `https://superfun.infura-ipfs.io/ipfs/${ipfsHash}`,
              tokenID: tokenId.toString(),
            };
            console.log(imageUrl,"imageUrl");
            return imageUrl;
          })
        );
    
        const blob = new Blob(
          [
            JSON.stringify({
              name,
              symbol,
              tokenPrice,
              tokenQuantity,
              imgTokenUrl,
              resultTime,
            }),
          ],
          { type: "application/json" }
        );
        const files = [new File([blob], "data.json")];
        const path = await addDataToIPFS(files[0]);
        const uri = `https://superfun.infura-ipfs.io/ipfs/${path}`;
        console.log(uri, "last uri");
    
        notify();
    
        const setCollectionOfUri = await lotteryContract.setCollectionUri(
          tokenContractAddress,
          uri
        );
        let txs = await setCollectionOfUri.wait();
        if (txs) {
          console.log(setCollectionOfUri, "setCollectionOfUris");
        }

      
        // const callRequestRandomWords = await lotteryContract.callRequestRandomWords(
        //   tokenContractAddress
        // );
        // let txrw = await callRequestRandomWords.wait();
        // if(txrw){
        //   console.log(callRequestRandomWords, "callRequestRandomWords");
        // }

        // const getWinner = await lotteryContract.getWinner(tokenContractAddress);
        // let txwinner = await getWinner.wait();
        // if(txwinner){
        //   console.log(getWinner, "callRequestRandomWords");
        //   setWinnerAddress(getWinner);
        // }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        // Clear form values after completing the form submission
        setName("");
        setTokenPrice("");
        setTokenQuantity("");
        setSymbol("");
        setUploadedImg("");
        setLoading(false);
      }
    };
    
    const Item = {
      name: name,
      symbol: symbol,
      price: tokenPrice,
      quantity: tokenQuantity,
      imgURl: uploadImg,
      resultTime: resultTime,
    };

    return(
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
          loading,
          onFormSubmit,
          getCollection,
          AllFilesArr
        }}
        >
          {props.children} 
        </LuckyPandaContext.Provider>
    )
}
  