import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import { MarketplaceContractABI, MarketplaceContractAddress } from "../../constants/abi";
import axios from "axios";
const ethers = require("ethers");

export default function AllCollections() {

  const [collections, setCollections] = useState([]);
  const [Img, setImg] = useState([]);

  const luckyPandaContext = useContext(LuckyPandaContext);
  const { collectionUris, getAllCollection } = luckyPandaContext;

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
      console.log(totalPrice, "value");
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
    console.log(collectionUris, "collectionUris")
    let images = [];

    collections.map(async (collection) => {
      // // let tokenIds = await MarketpaceContract.getAllTokenId(collection.address);
      // // setAllTokenIds(tokenIds.toString());


      axios.get(collection.uri)
        .then((response) => {
          console.log(response, "response");
          let obj = {};
          obj.address = collection.address;
          obj.name = response.data.name;
          obj.price = response.data.tokenPrice;
          // tokenIds.map((id) => {
          //   obj.tokenIds =  id.toString();

          //  })

          obj.images = [];
          response.data.imgTokenUrl.map((uri) => {
            obj.images.push(uri);
          })
          images.push(obj);
          setImg(images);
        })
        .catch((err) => {
          console.log(err, "error from axious response");
        })
    })
  }, [collections])
  console.log(collections, "collections");
  console.log(Img, "Imggg");

  return (
    <>
      <div className="container py-5">
        {Img.map((i) => (
          <div key={i.name}>
            <div className="row justify-content-center mb-5">
              <h2 className="col-12 text-center mb-2 fw-bold">{i.name}</h2>
              <h3 className="col-12 text-center text-muted">{i.address}</h3>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
              {i.images.map((img) => {
                // Check if the tokenId is in the sold items list
                const isSold = collections.some(
                  (collection) => collection.address === i.address &&
                    collection.soldItems.includes(img.tokenID)
                );

                return (
                  <div className="col" key={img.tokenID}>
                    <div className="card h-100 text-center">
                      <img src={img.url} className="card-img-top" alt={`${i.name}'s collection`} style={{ width: '100%', height: 'auto' }} />
                      <div className="card-body">
                        <h5 className="card-title">Ticket Id: {img.tokenID}</h5>
                        <button
                          type="button"
                          className={`btn ${isSold ? 'btn-secondary' : 'btn-outline-success'} mx-auto d-block`}
                          onClick={() => !isSold && purchaseItem(i.address, img.tokenID)}
                          disabled={isSold}
                        >
                          {isSold ? 'Sold Out' : `Buy for ${i.price}`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}