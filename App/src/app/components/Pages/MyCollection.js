import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LuckyPandaContext } from "../context/LuckyPandaContext";

export default function MyCollection() {

  const luckyPandaContext = useContext(LuckyPandaContext);

  const {mycollectionUris, getAllMyCollection } = luckyPandaContext;

  const [Img, setImg]= useState([]);

    

useEffect(() => {
getAllMyCollection();
},[])

useEffect(() => {
  console.log(mycollectionUris,"collectionUris")
  let images = [];

  mycollectionUris.map(async(collection) => {      
  // // let tokenIds = await MarketpaceContract.getAllTokenId(collection.address);
  // // setAllTokenIds(tokenIds.toString());

  
    axios.get(collection.uri)
     .then((response) => {
     console.log(response,"response");
      let obj = {};
      obj.address = collection.address;
      obj.name = response.data.name;
      obj.price = response.data.tokenPrice;
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
},[mycollectionUris])

return(

    <>
 <div className="container py-5">
      <h2 className="text-center mb-4">My Collections</h2>
      <div className="row g-4">
        {
          Img.map((i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i.images[0].tokenID}> {/* Adjust the column sizes as needed */}
              <div className="card h-100">
                <img src={i.images[0].url} className="card-img-top" width='230px' height='230px' alt={`${i.name}'s collection`} />
                <div className="card-body">
                  <Link to ={`/all-mycollections/${i.address}`} className="nav-link">   
                    <h5 className="card-title">{i.name}</h5>
                    <p className="card-text">{i.address}</p>
                  </Link>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>

    </>
)

}
