// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

import './NFT.sol';
    import './ChainlinkVRF.sol';

contract Marketplace is Ownable(msg.sender), ReentrancyGuard, AutomationCompatible{ 

    mapping (address => address[]) private tokens;
    mapping (address => uint256[] ) contractTokenIds;
    mapping (address => uint256[]) contractItemIds;  // Added mapping for contract to itemIds
    mapping (address => uint256[]) collectionsOfSoldItems;
    mapping (address => mapping(uint256 => MarketItem)) public marketItems;  // Updated mapping for collection to MarketItem
    mapping (address => string) collections;
    mapping(address => uint256) private lotteryRequestIds;

    address payable public feeAccount =  payable(address(this));
    address[] public CollectionAddresses;
    address public winner;
    uint256 public feePercent = 2;
    uint256 public getNFTCount; 
    uint256 private _ItemIdsCounter;    
        ChainlinkVRF public vrfContract;

    event TokenCreated(address, address);

     struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

      event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
   struct CollectionInfo {
     uint256 updateInterval;
     uint256 lastTimeStamp;
     uint256 winnerPercentage;
     bool allSold;
   }
  mapping(address => CollectionInfo) public collectionInfo;


    function createToken(
        string memory name,
        string memory symbol,
        uint256 updateInterval,
        uint256 winnerPercentage
    ) public {
        address _address = address(new NFT(name, symbol, updateInterval, winnerPercentage));
        collectionInfo[_address] = CollectionInfo({
        updateInterval: updateInterval,
        lastTimeStamp: block.timestamp,
        winnerPercentage: winnerPercentage,
        allSold: false
    });
        uint256 count = 0;
        tokens[msg.sender].push(_address);
        CollectionAddresses.push(_address);
        count++;
        emit TokenCreated(msg.sender, _address);
        // addNFTConsumer(subscriptionId, _address);
    }
    // function addNFTConsumer(uint64 subscriptionId, address tokenAddress) public  {
    //         VRFCoordinatorV2Interface(vrfCoordinator).addConsumer(subscriptionId, tokenAddress);
    // }
    
       function setVRFContract(address _vrfContract) external {
        vrfContract = ChainlinkVRF(_vrfContract);
       }
   function bulkMintERC721(
    address tokenAddress,
    uint256 start,
    uint256 end
) public {
    uint256 count = 0;
    for (uint256 i = start; i < end; i++) {
        uint256 tokenId = NFT(tokenAddress).safeMint(msg.sender);
        contractTokenIds[tokenAddress].push(tokenId);
        count++;
    }
    getNFTCount = count;
}
 function createMarketItem(
    address nftContractAddress,
    uint256 start,
    uint256 end,
    uint256 price
) public nonReentrant {
    for (uint256 i = start; i < end; i++) {
        uint256 tokenId = contractTokenIds[nftContractAddress][i];
        uint256 itemId = i;  
        marketItems[nftContractAddress][itemId] = MarketItem(
                itemId,
                nftContractAddress,
                tokenId,
                payable(msg.sender),
                payable(address(0)),
                price,
                false
            );

        IERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );
        contractItemIds[nftContractAddress].push(itemId);
        emit MarketItemCreated(
            itemId,
            nftContractAddress,
            tokenId,
            msg.sender,
            address(0),
            price
        );
    }
}


  function purchaseItem(address nftContract, uint256 tokenId) external payable nonReentrant {
    uint256 _totalPrice = getTotalPrice(nftContract, tokenId);
        MarketItem storage item = marketItems[nftContract][tokenId];

    require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
    require(!item.sold, "item already sold");

    // Transfer funds to the seller
    (bool successSeller, ) = item.seller.call{value: item.price}("");
    require(successSeller, "Transfer to seller failed");

    // Transfer funds to the fee account
    (bool successFee, ) = feeAccount.call{value: _totalPrice - item.price}("");
    require(successFee, "Transfer to fee account failed");

    item.sold = true; 

    // Use 'call' to transfer the NFT
    (bool successTransfer, ) = address(IERC721(nftContract)).call(
        abi.encodeWithSignature("transferFrom(address,address,uint256)", address(this), msg.sender, tokenId)
    );
    require(successTransfer, "NFT transfer failed");

    marketItems[nftContract][tokenId].owner = payable(msg.sender);
    collectionsOfSoldItems[nftContract].push(tokenId);
    emit Bought(item.itemId, nftContract, item.tokenId, item.price, item.seller, msg.sender);
}
function callRequestRandomWords(address tokenAddress) public returns(uint256) {
    uint256 nftCount = contractTokenIds[tokenAddress].length;
    uint256 requestId = vrfContract.requestRandomWords(nftCount);
    lotteryRequestIds[tokenAddress] = requestId;
    return requestId;
}

function getRequestStatus(uint256 _requestId) public view returns(bool, uint256){
       return vrfContract.getRequestStatus(_requestId);
}
 function setCollectionUri(address collectionContract, string memory uri) public{
            collections[collectionContract] = uri;
    }

function getCollectionUri(address collectionContract) public view returns(string memory){
       return collections[collectionContract];
    }

function getAllTokenId(address tokenContractAddress) public view returns (uint[] memory){
    uint[] memory ret = new uint[](getNFTCount);
    for (uint i = 0; i < getNFTCount; i++) {
        ret[i] = contractTokenIds[tokenContractAddress][i];
    } 
    return ret;
}
  
  function getAllContractAddresses() public view returns(address[] memory) {
   return CollectionAddresses;
  }
  
  function getAllSoldItems(address nftContract) external view returns (uint256[] memory) {
        return collectionsOfSoldItems[nftContract];
    }

  function getTotalPrice(address nftContract, uint256 tokenId) public view returns (uint256) {
        return ((marketItems[nftContract][tokenId].price * (100 + feePercent)) / 100);
    }
// function callRequestRandomWords(address tokenAddress) public returns(uint256) {
//     return NFT(tokenAddress).requestRandomWords();
//     }
//  function callGetRequestStatus(address tokenAddress, uint256 _requestId) public view returns(bool, uint256[] memory) {
//      return NFT(tokenAddress).getRequestStatus(_requestId);
//    }


function playLottery(address collectionAddress, uint256 requestId) public {
    require(lotteryRequestIds[collectionAddress] == requestId, "Invalid request ID");
    CollectionInfo storage info = collectionInfo[collectionAddress];
    require(info.allSold, "Not all NFTs are sold");
    require(block.timestamp >= info.lastTimeStamp + info.updateInterval, "Interval not reached");

    (bool fulfilled, uint256 randomTokenNumber) = getRequestStatus(requestId);
    require(fulfilled, "Random number not fulfilled");
    winner = getWinnerAddress(collectionAddress,randomTokenNumber);

    uint256 totalPrice = getTotalPrice(collectionAddress, randomTokenNumber);
    uint256 winnerAmount = (totalPrice * info.winnerPercentage) / 100;
    uint256 creatorAmount = totalPrice - winnerAmount;

    // Deduct fees from the winner and creator amounts
    uint256 winnerFinalAmount = winnerAmount - ((winnerAmount * feePercent) / 100);
    uint256 creatorFinalAmount = creatorAmount - ((creatorAmount * feePercent) / 100);

    payable(msg.sender).transfer(creatorFinalAmount);
    feeAccount.transfer((totalPrice * feePercent) / 100);
    payable(winner).transfer(winnerFinalAmount);    

    // Reset for the next lottery
    info.lastTimeStamp = block.timestamp;
    info.allSold = false;
}
function getWinnerAddress(address collectionAddress, uint256 winnerTokenId) internal view returns (address) {
    uint256[] memory soldItems = collectionsOfSoldItems[collectionAddress];
    require(winnerTokenId < soldItems.length, "Invalid winner tokenId");

    uint256 winnerTokenIdFromSoldItems = soldItems[winnerTokenId];
    MarketItem storage winningItem = marketItems[collectionAddress][winnerTokenIdFromSoldItems];

    return winningItem.owner;
}

function checkUpkeep(bytes calldata checkData)
    external
    override
    returns (bool upkeepNeeded, bytes memory performData)
{
    address collectionAddress = abi.decode(checkData, (address));
    CollectionInfo memory info = collectionInfo[collectionAddress];
    upkeepNeeded = (block.timestamp >= info.lastTimeStamp + info.updateInterval) && info.allSold;
    
    // Encode the requestId in the performData for later use in performUpkeep
    performData = abi.encode(lotteryRequestIds[collectionAddress]);
    
    return (upkeepNeeded, performData);
}

function performUpkeep(bytes calldata performData) external override {
    uint256 requestId = abi.decode(performData, (uint256));
    address collectionAddress = getCollectionAddress(requestId);

    // Ensure that the request corresponds to a valid collection
    require(collectionInfo[collectionAddress].updateInterval != 0, "Invalid collection");

    if ((block.timestamp - collectionInfo[collectionAddress].lastTimeStamp) > collectionInfo[collectionAddress].updateInterval) {
        playLottery(collectionAddress, requestId);
    }
}

// Helper function to retrieve the collection address from the requestId
function getCollectionAddress(uint256 requestId) internal view returns (address) {
    // You may need to adapt this based on how requestId is associated with the collection
    for (uint256 i = 0; i < CollectionAddresses.length; i++) {
        if (lotteryRequestIds[CollectionAddresses[i]] == requestId) {
            return CollectionAddresses[i];
        }
    }
    revert("Collection not found for the requestId");
}
  function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
      }
 function withdrawFunds(uint256 amount) external onlyOwner {
        uint256 currentBalance = address(this).balance;
        require(amount <=  currentBalance, "Insufficient funds");
        currentBalance -= amount;
        payable(msg.sender).transfer(amount);
    }
      receive() external payable {}

}