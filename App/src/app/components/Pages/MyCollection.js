import React, { useEffect } from "react";
import { MarketplaceContractABI, MarketplaceContractAddress } from "@/app/constants/abi";
export default function MyCollection() {

    async function getAllMyCollection(){
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
       
        
              try {
                const myCollectionAddresses = await MarketpaceContract.getOwnerContractAddresses();
                // Process myCollectionAddresses to display in the UI under 'My Collection'
                console.log(myCollectionAddresses, "myCollectionAddresses");
              } catch (error) {
                console.error("Error fetching my collections: ", error);
              }    
      }

useEffect(() => {
getAllMyCollection();
},[])

return(

    <>

    </>
)

}
