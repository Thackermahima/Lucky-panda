const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const mintContractParent = await hre.ethers.getContractFactory("mintContractParent");
  const mintcontractParent = await mintContractParent.deploy();
  
  console.log("mintContractParent contract address:", mintcontractParent.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  //0x46D9E01A910838F2b7DfE7557fa694c671b3A0A0