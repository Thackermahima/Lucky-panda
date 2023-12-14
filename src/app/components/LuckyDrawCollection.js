import React,{useState, useEffect} from "react";
import { Card, CardContent, CardActions, Box, Button, Typography } from '@mui/material';
import { lotteryEscrowABI, LotteryEscrowParentContract, lotteryEscrowParentABI } from "../constants/abi";
import axios from "axios";
const ethers = require("ethers") 

const LuckyDrawCollection = () => {
 
  const [collectionUris, setCollectionUris] = useState([]);
  const [Img, setImg] = useState([]);
  const [allTokenIds, setAllTokenIds] = useState();
  const [tokenAddresses, setTokenAddresses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getAllCollection(){
  let getCollectionOfUri;
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
 
  
  const allContractAddresses = await lotteryContract.getAllContractAddresses();
  console.log(allContractAddresses, "allContractAddress");
  const collectionuris = await Promise.all(
    allContractAddresses.map(async(addrs) => {
      const uri = await lotteryContract.getCollectionUri(addrs);
      const tokenId = await lotteryContract.getAllTokenId(addrs);
      console.log(tokenId, "tokenIds");
      console.log(addrs, "addrs from collectionuris");
      console.log(uri, "uri from collectionuris");
      return {address: addrs, uri: uri};
    })

    );
  setCollectionUris(collectionuris);
}
async function purchaseItem(tokenID, address, price){
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const lotteryContract = new ethers.Contract(
    LotteryEscrowParentContract,
    lotteryEscrowParentABI,
    signer
  );
  console.log(tokenID,address, price,"purchaseItem function argument");
  console.log(LotteryEscrowParentContract,{ value: ethers.parseUnits(price,"ether")},"msg.value");
  const purchaseItem = await lotteryContract.callPurchaseItem(tokenID,address, LotteryEscrowParentContract,{ value: ethers.parseUnits(price,"ether")});
  console.log(purchaseItem,"PurchaseItem");
  const txBuyNFT = await purchaseItem.wait();
  if(txBuyNFT){
    console.log("NFT is purchase");
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
    const lotteryContract = new ethers.Contract(
      LotteryEscrowParentContract,
      lotteryEscrowParentABI,
      signer
    );
  // // let tokenIds = await lotteryContract.getAllTokenId(collection.address);
  // // setAllTokenIds(tokenIds.toString());
  let getSoldItems = await lotteryContract.getSoldItems(collection.address, LotteryEscrowParentContract);
  console.log(getSoldItems, "getSoldItems");
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

            <button class="btn btn-outline-success mb-5" onClick={() => purchaseItem(img.tokenID, i.address, i.price)}>Buy for {i.price}</button>
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