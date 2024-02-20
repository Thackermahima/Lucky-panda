import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MarketplaceContractABI, MarketplaceContractAddress } from "@/app/constants/abi";
const ethers = require("ethers");

export default function LuckyDrawCollection() {
  const [collectionUris, setCollectionUris] = useState([]);
  const [Img, setImg] = useState([]);
  const [allTokenIds, setAllTokenIds] = useState();
  const [tokenAddresses, setTokenAddresses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState('');
  const [soldItems, setSoldItems] = useState([]);

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
        const soldItems = await MarketpaceContract.getAllSoldItems(addrs);
  
        // const tokenId = await MarketpaceContract.getAllTokenId(addrs);
        // console.log(tokenId, "tokenIds");
        console.log(addrs, "addrs from collectionuris");
        console.log(uri, "uri from collectionuris");
        return {address: addrs, uri: uri, soldItems: soldItems};
      })
  
      );
    setCollectionUris(collectionuris);
    setSoldItems(soldItems);
  
  }
  useEffect(() => {
    getAllCollection();
  }, []);
  
  useEffect(() => {
    console.log(collectionUris,"collectionUris")
    let images = [];
  
     collectionUris.map(async(collection) => {      
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
  
  useEffect(() => {
    Img.map(async(i) => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const MarketpaceContract = new ethers.Contract(
        MarketplaceContractAddress,
        MarketplaceContractABI,
        signer
      );
      const getWinner = await MarketpaceContract.getCollectionWinner(i.address);
      console.log(getWinner,"getWinner");
    }) 
  },[])

    return(
        <div className="container py-5">
        <h2 className="text-center mb-4">Explore Collections</h2>

        <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100">

        {
 Img.map((i) => {
  console.log(i.address);
  console.log(i.name);
 })

}
                <img src='Winner.webp' className="card-img-top" width='230px' height='230px' />
                <div className="card-body">
                <Link to="/all-collections" className="nav-link px-2">   
                               <h5 className="card-title">Alex's collection</h5>
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
}