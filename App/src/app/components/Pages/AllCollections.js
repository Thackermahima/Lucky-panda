import React,{ useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import { MarketplaceContractABI, MarketplaceContractAddress } from "@/app/constants/abi";
import axios from "axios";

export default function AllCollections() {

  const [collections, setCollections] = useState([]);
  const [Img, setImg] = useState([]);

  const luckyPandaContext = useContext(LuckyPandaContext);
  const {collectionUris, getAllCollection } = luckyPandaContext;

  const { address } = useParams();
 
  async function purchaseItem(address, tokenID) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const MarketpaceContract = new ethers.Contract(
      MarketplaceContractAddress,
      MarketplaceContractABI,
      signer
    );
    try {
      const totalPrice = await MarketpaceContract.getTotalPrice(address, tokenID);
      console.log(tokenID, address, totalPrice, "callPurchaseArguments");
      console.log(totalPrice,"value");
      const purchaseItemTx = await MarketpaceContract.purchaseItem(address, tokenID, {
        value: totalPrice,
      });
  
      const txReceipt = await purchaseItemTx.wait();
      console.log(txReceipt, "txReceipt");
      if (txReceipt && txReceipt.status === 1) {
        console.log("NFT purchased");
      //   toast.success("🚀 NFT Purchased! Welcome to the world of digital art.", {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      // });
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
    if (address && collectionUris) {
      // Make sure collectionUris is not empty and is an array
      if (Array.isArray(collectionUris) && collectionUris.length > 0) {
        const collectionsForAddress = collectionUris.filter((collection) => {
          return collection.address.toLowerCase() === address.toLowerCase();
        });
        setCollections(collectionsForAddress);
      }
    }
  }, [address, collectionUris]);
  

  useEffect(() => {
    console.log(collectionUris,"collectionUris")
    let images = [];
  
     collections.map(async(collection) => {      
    // // let tokenIds = await MarketpaceContract.getAllTokenId(collection.address);
    // // setAllTokenIds(tokenIds.toString());
  
    
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
  console.log(collections, "collections");
    return (
        <>
          <div className="container py-5">
      <div className="row g-4">
        {
          Img.map((i) => 
          console.log(Img, "Imgsss")

          (
            <div className="col-12 col-md-6 col-lg-4"> {/* Adjust the column sizes as needed */}
              <div className="card h-100">
             { 
             i.images.map((img) => (
              <>
              <img src={img.url} className="card-img-top" width='230px' height='230px' alt={`${i.name}'s collection`} />

              <div className="card-body">
                <button
                            type="button"
                            class="btn btn-outline-success"
                            onClick={() => purchaseItem(i.address,img.tokenID)}

                          >
                            Buy for {i.price}
                            </button>
                </div>
                </>

             )
            )}  
              </div>
            </div>
          ))
        }
      </div>
    </div>
        </>
    )
}