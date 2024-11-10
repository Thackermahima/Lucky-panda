import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import { MarketplaceContractABI, MarketplaceContractAddress } from "../../constants/abi";
const ethers = require("ethers");


export default function NFTReadership() {
  const [Img, setImg] = useState([]);
  const [allTokenIds, setAllTokenIds] = useState();
  const [tokenAddresses, setTokenAddresses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState('');

  const luckyPandaContext = useContext(LuckyPandaContext);

  const { collectionUris, getAllCollection } = luckyPandaContext;
  useEffect(() => {
    getAllCollection();
  }, []);

  useEffect(() => {
    console.log(collectionUris, "collectionUris")
    let images = [];

    collectionUris.map(async (collection) => {
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
          console.log(response.data.imgTokenUrl, "imgTokenUrl");
          response.data.imgTokenUrl.map((uri) => {
            obj.images.push(uri);
          })
          console.log(obj, "obj");
          images.push(obj);
          console.log(images, "images");
          setImg(images);
        })
        .catch((err) => {
          console.log(err, "error from axious response");
        })
    })
  }, [collectionUris])

  // useEffect(() => {
  //   Img.map(async(i) => {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const MarketpaceContract = new ethers.Contract(
  //       MarketplaceContractAddress,
  //       MarketplaceContractABI,
  //       signer
  //     );
  //     const getWinner = await MarketpaceContract.getCollectionWinner(i.address);
  //     console.log(getWinner,"getWinner");
  //   }) 
  // },[])

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Explore Collections</h2>
      <div className="row g-4">
        {
          Img.map((i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i.images[0].tokenID}> {/* Adjust the column sizes as needed */}
              <div className="card h-100">
                <img src={i.images[0].url} className="card-img-top" width='230px' height='230px' alt={`${i.name}'s collection`} />
                <div className="card-body">
                  <Link to={`/all-collections/${i.address}`} className="nav-link">
                    <h5 className="card-title">{i.name}'s collection</h5>
                    <p className="card-text">{i.address}</p>
                  </Link>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}