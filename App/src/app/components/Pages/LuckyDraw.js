import React, {useState, useEffect, useContext} from "react";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import axios from "axios";
import { Link } from 'react-router-dom';

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
            obj.hasWinner = collection.hasWinner;
            obj.winnerAddress = collection.winnerAddress;
            obj.winningTokenId = collection.winningTokenId;
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
      <h2 className="text-center mb-4">And The Winner Is...</h2>
      <div className="row g-4">
        {Img.map((i, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={i.images[0].tokenID}>
            <div className="card h-100 shadow-sm">
              <img src={i.images[0].url} className="card-img-top" alt={`${i.name}'s collection`} />
              <div className="card-body">
                <h5 className="card-title">{i.name}'s Collection</h5>
                <p className="card-text text-muted mb-2">Collection Address: <span className="text-primary">{i.address}</span></p>
                <div className="card-text mb-3">
                  {i.hasWinner ? (
                    <>
                      <span className="badge rounded-pill bg-success">Winner Declared</span>
                      <div className="mt-2">
                        <p className="mb-1"><strong>Winner:</strong> {i.winnerAddress}</p>
                        <p><strong>Winner Ticket Id:</strong> {i.winningTokenId.toString()}</p>
                      </div>
                    </>
                  ) : (
                    <span className="badge rounded-pill bg-warning text-dark">Winner will be declared soon</span>
                  )}
                </div>
                <Link to ={`/all-collections/${i.address}`} className="nav-link">   
                <button className="btn btn-outline-primary w-100 mt-2">View Collection</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    )

}