import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import { MarketplaceContractABI, MarketplaceContractAddress } from "../../constants/abi";
import axios from "axios";

export default function AllCollections() {

  const [myallcollections, setmyallCollections] = useState([]);
  const [Img, setImg] = useState([]);


  const { address } = useParams();
  const luckyPandaContext = useContext(LuckyPandaContext);

  const { mycollectionUris, getAllMyCollection } = luckyPandaContext;

  useEffect(() => {
    if (address && mycollectionUris) {
      // Make sure collectionUris is not empty and is an array
      if (Array.isArray(mycollectionUris) && mycollectionUris.length > 0) {
        const collectionsForAddress = mycollectionUris.filter((collection) => {
          return collection.address.toLowerCase() === address.toLowerCase();
        });
        setmyallCollections(collectionsForAddress);
      }
    }
  }, [address, mycollectionUris]);


  useEffect(() => {
    console.log(mycollectionUris, "collectionUris");

    let images = [];
    myallcollections.map(async (collection) => {
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
  }, [myallcollections])
  console.log(myallcollections, "collections");
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
              {i.images.map((img) => (
                <div className="col" key={img.tokenID}>
                  <div className="card h-100 text-center">
                    <img src={img.url} className="card-img-top" alt={`${i.name}'s collection`} style={{ width: '100%', height: 'auto' }} />
                    <div className="card-body">
                      <h5 className="card-title">Ticket Id: {img.tokenID}</h5>
                    </div>
                  </div>
                </div>
              )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}