const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const MarketPlace = await hre.ethers.getContractFactory("Marketplace");
  const MarketPlaceContract = await MarketPlace.deploy();
  console.log("MarketPlace contract address:", MarketPlaceContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
