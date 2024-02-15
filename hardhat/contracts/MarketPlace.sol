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
    mapping(address => uint256) public lotteryRequestIds;
    mapping(address => address) public collectionWinners;

    address payable public feeAccount =  payable(address(this));
    address[] public CollectionAddresses;
    address public winner;
    uint256 public feePercent = 2;
    uint256 public getNFTCount; 
    uint256 private _ItemIdsCounter;   
    uint256 public totalFeesCollected; 
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
        uint256 escrowAmount;
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
    
       function setVRFContract(address _vrfContract) external onlyOwner{
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
                false,
                0
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


//   function purchaseItem(address nftContract, uint256 tokenId) external payable nonReentrant {
//     uint256 _totalPrice = getTotalPrice(nftContract, tokenId);
//         MarketItem storage item = marketItems[nftContract][tokenId];

//     require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
//     require(!item.sold, "item already sold");

//     // Transfer funds to the seller
//     (bool successSeller, ) = item.seller.call{value: item.price}("");
//     require(successSeller, "Transfer to seller failed");

//     // Transfer funds to the fee account
//     (bool successFee, ) = feeAccount.call{value: _totalPrice - item.price}("");
//     require(successFee, "Transfer to fee account failed");

//     item.sold = true; 

//     // Use 'call' to transfer the NFT
//     (bool successTransfer, ) = address(IERC721(nftContract)).call(
//         abi.encodeWithSignature("transferFrom(address,address,uint256)", address(this), msg.sender, tokenId)
//     );
//     require(successTransfer, "NFT transfer failed");

//     marketItems[nftContract][tokenId].owner = payable(msg.sender);
//     collectionsOfSoldItems[nftContract].push(tokenId);
//     if (collectionsOfSoldItems[nftContract].length == getNFTCount) {
//         CollectionInfo storage info = collectionInfo[nftContract];
//         info.allSold = true;
//     }
//     emit Bought(item.itemId, nftContract, item.tokenId, item.price, item.seller, msg.sender);
// }

function purchaseItem(address nftContract, uint256 tokenId) external payable nonReentrant {
    uint256 _totalPrice = getTotalPrice(nftContract, tokenId);
    MarketItem storage item = marketItems[nftContract][tokenId];
    uint256 itemPrice = item.price;

    require(msg.value >= _totalPrice, "Not enough ether to cover item price and market fee");
    require(!item.sold, "Item already sold");
   uint256 feeAmount = calculateFee(itemPrice);
   uint256 escrowAmount = itemPrice; 
    item.sold = true; 
    item.escrowAmount += escrowAmount;
    marketItems[nftContract][tokenId].owner = payable(msg.sender);
    collectionsOfSoldItems[nftContract].push(tokenId);

    if (collectionsOfSoldItems[nftContract].length == getNFTCount) {
        collectionInfo[nftContract].allSold = true;
    }

    emit Bought(item.itemId, nftContract, item.tokenId, item.price, item.seller, msg.sender);
}
function callRequestRandomWords(address tokenAddress) public returns(uint256) {
    uint256 nftCount = contractTokenIds[tokenAddress].length;
    uint256 requestId = vrfContract.requestRandomWords(nftCount, tokenAddress);
    lotteryRequestIds[tokenAddress] = requestId;
    return requestId;
}
 function getRequestIdForCollection(address collectionAddress)
        public
        view
        returns (uint256)
    {
        return vrfContract.getRequestIdForCollection(collectionAddress);
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

  function getTotalPriceForCollection(address nftContract) public view returns (uint256) {
    uint256 totalCollectionPrice = 0;
    uint256 totalTokens = contractTokenIds[nftContract].length; // Assuming this keeps track of all token IDs in the collection

    for (uint256 i = 0; i < totalTokens; i++) {
        uint256 tokenId = contractTokenIds[nftContract][i];
        MarketItem storage item = marketItems[nftContract][tokenId];
        if (item.sold) {
            totalCollectionPrice += (item.price * (100 + feePercent)) / 100;
        }
    }

    return totalCollectionPrice;
}
// function callRequestRandomWords(address tokenAddress) public returns(uint256) {
//     return NFT(tokenAddress).requestRandomWords();
//     }
//  function callGetRequestStatus(address tokenAddress, uint256 _requestId) public view returns(bool, uint256[] memory) {
//      return NFT(tokenAddress).getRequestStatus(_requestId);
//    }

function playLottery(address collectionAddress, uint256 requestId) internal {
    require(lotteryRequestIds[collectionAddress] == requestId, "Invalid request ID");
    CollectionInfo storage info = collectionInfo[collectionAddress];
    require(info.allSold, "Not all NFTs are sold");

    (bool fulfilled, uint256 randomTokenNumber) = getRequestStatus(requestId);
    require(fulfilled, "Random number not fulfilled");
    winner = getWinnerAddress(collectionAddress, requestId);
    collectionWinners[collectionAddress] = winner;

    uint256 totalEscrowedAmount = calculateTotalEscrowedAmount(collectionAddress);

    // Calculate the winner's prize directly from the escrow amount.
    uint256 winnerPrize = (totalEscrowedAmount * info.winnerPercentage) / 100;

    // Send the winner's prize.
    (bool winnerSent, ) = payable(winner).call{value: winnerPrize}("");
    require(winnerSent, "Failed to send prize to winner");

    // Calculate the remaining amount to be sent to the seller (creator of the collection).
    uint256 remainingToSeller = totalEscrowedAmount - winnerPrize;

    // Assuming the first item's seller is the collection's creator.
    if(contractTokenIds[collectionAddress].length > 0) {
        MarketItem storage firstItem = marketItems[collectionAddress][0];
        address payable sellerAddress = firstItem.seller;

        // Send the remaining amount to the seller.
        (bool sellerSent, ) = sellerAddress.call{value: remainingToSeller}("");
        require(sellerSent, "Failed to send remaining funds to seller");

        // Reset escrow amounts for all items in the collection.
        for (uint256 i = 0; i < contractTokenIds[collectionAddress].length; i++) {
            marketItems[collectionAddress][i].escrowAmount = 0;
        }
    }

    // Reset the collection for the next lottery.
    info.lastTimeStamp = block.timestamp;
    info.allSold = false;
}



function calculateTotalEscrowedAmount(address collectionAddress) private view returns (uint256 totalEscrowed) {
    uint256 totalTokens = contractTokenIds[collectionAddress].length;
    for (uint256 i = 0; i < totalTokens; i++) {
        MarketItem storage item = marketItems[collectionAddress][i];
        if (item.sold) {
            totalEscrowed += item.escrowAmount;
        }
    }
}

function calculateFee(uint256 amount) private view returns (uint256) {
    return (amount * feePercent) / 100;
}

  function getWinnerAddress(address collectionAddress, uint256 requestId) public view returns (address) {
    (bool fulfilled, uint256 randomTokenNumber) = getRequestStatus(requestId);

    require(fulfilled, "Random number not fulfilled");

    MarketItem storage winningItem = marketItems[collectionAddress][randomTokenNumber];

    return winningItem.owner;
}

function getCollectionWinner(address collectionAddress) external view returns (address) {
        return collectionWinners[collectionAddress];
    }
    
function checkUpkeep(bytes calldata /* checkData */) 
external
view 
override 
returns (bool upkeepNeeded, bytes memory performData) {
    for (uint i = 0; i < CollectionAddresses.length; i++) {
        address collectionAddress = CollectionAddresses[i];
        CollectionInfo memory info = collectionInfo[collectionAddress];

        if ((block.timestamp - info.lastTimeStamp) > info.updateInterval && info.allSold) {
            // If any collection meets the criteria, return true
            upkeepNeeded = true;
            // Encode the collection address to performData for performUpkeep
            performData = abi.encode(collectionAddress);
            return (upkeepNeeded, performData);
        }
    }

    // If no collection meets the criteria, return false
    return (false, "");
}

function performUpkeep(bytes calldata performData) external override {
    address collectionAddress = abi.decode(performData, (address));
    CollectionInfo memory info = collectionInfo[collectionAddress];
    if ((block.timestamp - info.lastTimeStamp) > info.updateInterval && info.allSold) {
        uint256 requestId = lotteryRequestIds[collectionAddress];
        playLottery(collectionAddress, requestId);
    }
}



// Helper function to retrieve the collection address from the requestId
// function getCollectionAddress(uint256 requestId) internal view returns (address) {
//     // You may need to adapt this based on how requestId is associated with the collection
//     for (uint256 i = 0; i < CollectionAddresses.length; i++) {
//         if (lotteryRequestIds[CollectionAddresses[i]] == requestId) {
//             return CollectionAddresses[i];
//         }
//     }
//     revert("Collection not found for the requestId");
// }
function getCollectionAddress(uint256 requestId) public view returns (address) {
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

function withdrawCollectedFees(address payable destination, uint256 amount) external onlyOwner {
    require(amount <= totalFeesCollected, "Amount exceeds collected fees");
    require(destination != address(0), "Invalid destination address");

    totalFeesCollected -= amount; // Adjust the tracked fee balance
    destination.transfer(amount); // Transfer the requested amount
}
}