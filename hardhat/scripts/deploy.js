const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const LotteryEscrowParent = await hre.ethers.getContractFactory("LotteryEscrowParent");
  const LotteryEscrowParentContract = await LotteryEscrowParent.deploy();
  
  console.log("LotteryEscrowParent contract address:", LotteryEscrowParentContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  //0x46D9E01A910838F2b7DfE7557fa694c671b3A0A0