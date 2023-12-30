import React,{useState, useEffect} from "react";
import { Card, CardContent, CardActions, Box, Button, Typography } from '@mui/material';
import { MarketplaceContractAddress, MarketplaceContractABI } from "../constants/abi";
import axios from "axios";
const ethers = require("ethers");

const LuckyDrawCollection = () => {
 
  const [collectionUris, setCollectionUris] = useState([]);
  const [Img, setImg] = useState([]);
  const [allTokenIds, setAllTokenIds] = useState();
  const [tokenAddresses, setTokenAddresses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState('');
  async function getAllCollection(){
  let getCollectionOfUri;
  const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const MarketpaceContract = new ethers.Contract(
          MarketplaceContractAddress,
          MarketplaceContractABI,
          signer
        );
 
  
  const allContractAddresses = await MarketpaceContract.getAllContractAddresses();
  console.log(allContractAddresses, "allContractAddress");
  const collectionuris = await Promise.all(
    allContractAddresses.map(async(addrs) => {
      const uri = await MarketpaceContract.getCollectionUri(addrs);
      // const tokenId = await MarketpaceContract.getAllTokenId(addrs);
      // console.log(tokenId, "tokenIds");
      console.log(addrs, "addrs from collectionuris");
      console.log(uri, "uri from collectionuris");
      return {address: addrs, uri: uri};
    })

    );
  setCollectionUris(collectionuris);
}

async function purchaseItem(address, tokenID) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const MarketpaceContract = new ethers.Contract(
    MarketplaceContractAddress,
    MarketplaceContractABI,
    signer
  );
  try {
    const totalPrice = await MarketpaceContract.getTotalPrice(tokenID);
    console.log(tokenID, address, totalPrice, "callPurchaseArguments");
    console.log(totalPrice,"value");
    const purchaseItemTx = await MarketpaceContract.purchaseItem(address, tokenID, {
      value: totalPrice,
    });

    const txReceipt = await purchaseItemTx.wait();
    console.log(txReceipt, "txReceipt");
    if (txReceipt && txReceipt.status === 1) {
      console.log("NFT purchased");
    } else {
      console.log("Transaction failed or was dropped");
    }
  } catch (error) {
    console.error("Transaction submission failed:", error);
    console.log("Error code:", error.code);
    console.log("Error data:", error.data);
    if (error.transaction) {
      console.log("Transaction data:", error.transaction);
    }
  }
}


useEffect(() => {
  getAllCollection();
}, []);

useEffect(() => {
  console.log(collectionUris,"collectionUris")
  let images = [];

   collectionUris.map(async(collection) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const MarketpaceContract = new ethers.Contract(
      MarketplaceContractAddress,
      MarketplaceContractABI,
      signer
    );
  // // let tokenIds = await MarketpaceContract.getAllTokenId(collection.address);
  // // setAllTokenIds(tokenIds.toString());
//   let getSoldItems = await MarketpaceContract.getSoldItems();
//   console.log(getSoldItems, "getSoldItems");
  
    axios.get(collection.uri)
     .then((response) => {
     console.log(response,"response");
      let obj = {};
      obj.address = collection.address;
      obj.name = response.data.name;
      obj.price = response.data.tokenPrice;
      // tokenIds.map((id) => {
      //   obj.tokenIds =  id.toString();
      
      //  })
      obj.images = [];
      console.log(response.data.imgTokenUrl,"imgTokenUrl");
      response.data.imgTokenUrl.map((uri) => {
      obj.images.push(uri);
      })
      console.log(obj,"obj");
     images.push(obj);
     console.log(images, "images");
     setImg(images);
     })
    .catch((err) => {
      console.log(err,"error from axious response");
    })
    })
},[collectionUris])


    return (
        <Box
       sx={{
        mt:'10%',
        mb:'5%'
       }}
        // height="100vh"
      >
         <Typography variant="h5" align="center" style={{ marginTop: '2rem' }}>
Explore Lottery Collections 
</Typography>
        <Card sx={{ width:'20%'}}>
        {console.log(Img,"Img")}  

        {Img.length > 0 ? <div>
{
  Img.map((i) => {
    return(
      <>
      <CardContent>
      <Typography>{i.address}</Typography>
      <Typography>{i.name}</Typography>

     
         {i.images.map((img) => {
          return (
            <>
            <img src={img.url} height="200px" width="500px"/>
{console.log(img.tokenID, "img.tokenId")}
{console.log(i.price, "i.price")}
{console.log(i.address, "i.address")}
{console.log(price, "i.price")}

            <button class="btn btn-outline-success mb-5" onClick={() => purchaseItem(i.address,img.tokenID)}>Buy for {i.price}</button>
            </>

          )
         })}
     </CardContent>
     <br />
   
     </>
    )
  })
}
        </div> : <div>No listed Items</div> }
      
      </Card>
      </Box>
    );
  
  

}
export default LuckyDrawCollection
