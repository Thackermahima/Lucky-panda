import React, {useState, useEffect, useContext} from "react";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import axios from "axios";

export default function LuckyDraw() {

    const [Img, setImg] = useState([]);
  
    const luckyPandaContext = useContext(LuckyPandaContext);
    const {allCollectionUris, getAllContractCollection} = luckyPandaContext;

    useEffect(() => {
        getAllContractCollection();
      }, []);
    
      useEffect(() => {
        console.log(allCollectionUris,"collectionUrisss")
        let images = [];
      
        allCollectionUris.map(async(collection) => {      
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
      },[allCollectionUris])

    return(
        <div className="container py-5">
      <h2 className="text-center mb-4">And The Winner Is..</h2>
      <div className="row g-4">
        {
          Img.map((i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i.images[0].tokenID}> {/* Adjust the column sizes as needed */}
              <div className="card h-100">
                <img src={i.images[0].url} className="card-img-top" width='230px' height='230px' alt={`${i.name}'s collection`} />
                <div className="card-body">
                    <h5 className="card-title">Name of Collection: {i.name}</h5>
                    <p className="card-text">Collection address: {i.address}</p>

                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    )

}