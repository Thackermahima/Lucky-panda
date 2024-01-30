// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// import './NFT.sol';
// import './ChainlinkVRF.sol';

// contract Marketplace is Ownable(msg.sender), ReentrancyGuard, AutomationCompatible{ 

//     mapping (address => address[]) private tokens;
//     mapping (address => uint256[] ) contractTokenIds;
//     mapping (address => uint256[]) contractItemIds;  // Added mapping for contract to itemIds
//     mapping (address => uint256[]) collectionsOfSoldItems;
//     mapping (address => mapping(uint256 => MarketItem)) public marketItems;  // Updated mapping for collection to MarketItem
//     mapping (address => string) collections;
//     mapping(address => uint256) private lotteryRequestIds;
//     mapping(address => address) public collectionWinners;

//     address payable public feeAccount =  payable(address(this));
//     address[] public CollectionAddresses;
//     address public winner;
//     uint256 public feePercent = 2;
//     uint256 public getNFTCount; 
//     uint256 private _ItemIdsCounter;    
//         ChainlinkVRF public vrfContract;

//     event TokenCreated(address, address);

//      struct MarketItem {
//         uint256 itemId;
//         address nftContract;
//         uint256 tokenId;
//         address payable seller;
//         address payable owner;
//         uint256 price;
//         bool sold;
//     }

//     event MarketItemCreated(
//         uint256 indexed itemId,
//         address indexed nftContract,
//         uint256 indexed tokenId,
//         address seller,
//         address owner,
//         uint256 price
//     );

//       event Bought(
//         uint256 itemId,
//         address indexed nft,
//         uint256 tokenId,
//         uint256 price,
//         address indexed seller,
//         address indexed buyer
//     );
//    struct CollectionInfo {
//      uint256 updateInterval;
//      uint256 lastTimeStamp;
//      uint256 winnerPercentage;
//      bool allSold;
//    }
//   mapping(address => CollectionInfo) public collectionInfo;


//     function createToken(
//         string memory name,
//         string memory symbol,
//         uint256 updateInterval,
//         uint256 winnerPercentage
//     ) public {
//         address _address = address(new NFT(name, symbol, updateInterval, winnerPercentage));
//         collectionInfo[_address] = CollectionInfo({
//         updateInterval: updateInterval,
//         lastTimeStamp: block.timestamp,
//         winnerPercentage: winnerPercentage,
//         allSold: false
//     });
//         uint256 count = 0;
//         tokens[msg.sender].push(_address);
//         CollectionAddresses.push(_address);
//         count++;
//         emit TokenCreated(msg.sender, _address);
//         // addNFTConsumer(subscriptionId, _address);
//     }
//     // function addNFTConsumer(uint64 subscriptionId, address tokenAddress) public  {
//     //         VRFCoordinatorV2Interface(vrfCoordinator).addConsumer(subscriptionId, tokenAddress);
//     // }
    
//        function setVRFContract(address _vrfContract) external onlyOwner{
//         vrfContract = ChainlinkVRF(_vrfContract);
//        }
//    function bulkMintERC721(
//     address tokenAddress,
//     uint256 start,
//     uint256 end
// ) public {
//     uint256 count = 0;
//     for (uint256 i = start; i < end; i++) {
//         uint256 tokenId = NFT(tokenAddress).safeMint(msg.sender);
//         contractTokenIds[tokenAddress].push(tokenId);
//         count++;
//     }
//     getNFTCount = count;
// }
//  function createMarketItem(
//     address nftContractAddress,
//     uint256 start,
//     uint256 end,
//     uint256 price
// ) public nonReentrant {
//     for (uint256 i = start; i < end; i++) {
//         uint256 tokenId = contractTokenIds[nftContractAddress][i];
//         uint256 itemId = i;  
//         marketItems[nftContractAddress][itemId] = MarketItem(
//                 itemId,
//                 nftContractAddress,
//                 tokenId,
//                 payable(msg.sender),
//                 payable(address(0)),
//                 price,
//                 false
//             );

//         IERC721(nftContractAddress).transferFrom(
//             msg.sender,
//             address(this),
//             tokenId
//         );
//         contractItemIds[nftContractAddress].push(itemId);
//         emit MarketItemCreated(
//             itemId,
//             nftContractAddress,
//             tokenId,
//             msg.sender,
//             address(0),
//             price
//         );
//     }
// }


// //   function purchaseItem(address nftContract, uint256 tokenId) external payable nonReentrant {
// //     uint256 _totalPrice = getTotalPrice(nftContract, tokenId);
// //         MarketItem storage item = marketItems[nftContract][tokenId];

// //     require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
// //     require(!item.sold, "item already sold");

// //     // Transfer funds to the seller
// //     (bool successSeller, ) = item.seller.call{value: item.price}("");
// //     require(successSeller, "Transfer to seller failed");

// //     // Transfer funds to the fee account
// //     (bool successFee, ) = feeAccount.call{value: _totalPrice - item.price}("");
// //     require(successFee, "Transfer to fee account failed");

// //     item.sold = true; 

// //     // Use 'call' to transfer the NFT
// //     (bool successTransfer, ) = address(IERC721(nftContract)).call(
// //         abi.encodeWithSignature("transferFrom(address,address,uint256)", address(this), msg.sender, tokenId)
// //     );
// //     require(successTransfer, "NFT transfer failed");

// //     marketItems[nftContract][tokenId].owner = payable(msg.sender);
// //     collectionsOfSoldItems[nftContract].push(tokenId);
// //     if (collectionsOfSoldItems[nftContract].length == getNFTCount) {
// //         CollectionInfo storage info = collectionInfo[nftContract];
// //         info.allSold = true;
// //     }
// //     emit Bought(item.itemId, nftContract, item.tokenId, item.price, item.seller, msg.sender);
// // }

// function purchaseItem(address nftContract, uint256 tokenId) external payable nonReentrant {
//     uint256 _totalPrice = getTotalPrice(nftContract, tokenId);
//     MarketItem storage item = marketItems[nftContract][tokenId];

//     require(msg.value >= _totalPrice, "Not enough ether to cover item price and market fee");
//     require(!item.sold, "Item already sold");

//     // Transfer item base price to the seller
//     (bool successSeller, ) = item.seller.call{value: item.price}("");
//     require(successSeller, "Transfer to seller failed");
//     item.sold = true; 
//     marketItems[nftContract][tokenId].owner = payable(msg.sender);
//     collectionsOfSoldItems[nftContract].push(tokenId);

//     if (collectionsOfSoldItems[nftContract].length == getNFTCount) {
//         collectionInfo[nftContract].allSold = true;
//     }

//     emit Bought(item.itemId, nftContract, item.tokenId, item.price, item.seller, msg.sender);
// }

// function callRequestRandomWords(address tokenAddress) public returns(uint256) {
//     uint256 nftCount = contractTokenIds[tokenAddress].length;
//     uint256 requestId = vrfContract.requestRandomWords(nftCount, tokenAddress);
//     lotteryRequestIds[tokenAddress] = requestId;
//     return requestId;
// }
//  function getRequestIdForCollection(address collectionAddress)
//         public
//         view
//         returns (uint256)
//     {
//         return vrfContract.getRequestIdForCollection(collectionAddress);
//     }

// function getRequestStatus(uint256 _requestId) public view returns(bool, uint256){
//        return vrfContract.getRequestStatus(_requestId);
// }
//  function setCollectionUri(address collectionContract, string memory uri) public{
//             collections[collectionContract] = uri;
//     }

// function getCollectionUri(address collectionContract) public view returns(string memory){
//        return collections[collectionContract];
//     }

// function getAllTokenId(address tokenContractAddress) public view returns (uint[] memory){
//     uint[] memory ret = new uint[](getNFTCount);
//     for (uint i = 0; i < getNFTCount; i++) {
//         ret[i] = contractTokenIds[tokenContractAddress][i];
//     } 
//     return ret;
// }
  
//   function getAllContractAddresses() public view returns(address[] memory) {
//    return CollectionAddresses;
//   }
  
//   function getAllSoldItems(address nftContract) external view returns (uint256[] memory) {
//         return collectionsOfSoldItems[nftContract];
//     }

//   function getTotalPrice(address nftContract, uint256 tokenId) public view returns (uint256) {
//         return ((marketItems[nftContract][tokenId].price * (100 + feePercent)) / 100);
//     }

//   function getTotalPriceForCollection(address nftContract) public view returns (uint256) {
//     uint256 totalCollectionPrice = 0;
//     uint256 totalTokens = contractTokenIds[nftContract].length; // Assuming this keeps track of all token IDs in the collection

//     for (uint256 i = 0; i < totalTokens; i++) {
//         uint256 tokenId = contractTokenIds[nftContract][i];
//         MarketItem storage item = marketItems[nftContract][tokenId];
//         if (item.sold) {
//             totalCollectionPrice += (item.price * (100 + feePercent)) / 100;
//         }
//     }

//     return totalCollectionPrice;
// }
// // function callRequestRandomWords(address tokenAddress) public returns(uint256) {
// //     return NFT(tokenAddress).requestRandomWords();
// //     }
// //  function callGetRequestStatus(address tokenAddress, uint256 _requestId) public view returns(bool, uint256[] memory) {
// //      return NFT(tokenAddress).getRequestStatus(_requestId);
// //    }


// function playLottery(address collectionAddress, uint256 requestId) internal {
//     require(lotteryRequestIds[collectionAddress] == requestId, "Invalid request ID");
//     CollectionInfo storage info = collectionInfo[collectionAddress];
//     require(info.allSold, "Not all NFTs are sold");

//     (bool fulfilled, uint256 randomTokenNumber) = getRequestStatus(requestId);
//     require(fulfilled, "Random number not fulfilled");
//     winner = getWinnerAddress(collectionAddress, requestId);
//     collectionWinners[collectionAddress] = winner;

//     uint256 totalPrice = getTotalPriceForCollection(collectionAddress);

//     // Calculate the fee amount (2% of total price)
//     uint256 feeAmount = (totalPrice * feePercent) / 100;

//     // Subtract the fee amount from the total price
//     uint256 amountAfterFee = totalPrice - feeAmount;

//     // Calculate the winner's amount based on the winner percentage
//     uint256 winnerAmount = (amountAfterFee * info.winnerPercentage) / 100;

//     // The rest of the amount goes to the creator
//     uint256 creatorAmount = amountAfterFee - winnerAmount;

//     // Transfer winner's amount
//     (bool sent, ) = payable(winner).call{value: winnerAmount}("");
//     require(sent, "Failed to send Ether to winner");

//     // Transfer the remaining amount to the creator
//     (sent, ) = msg.sender.call{value: creatorAmount}("");
//     require(sent, "Failed to send Ether to creator");

//     // Reset for the next lottery
//     info.lastTimeStamp = block.timestamp;
//     info.allSold = false;
// }




//   function getWinnerAddress(address collectionAddress, uint256 requestId) public view returns (address) {
//     (bool fulfilled, uint256 randomTokenNumber) = getRequestStatus(requestId);

//     require(fulfilled, "Random number not fulfilled");

//     MarketItem storage winningItem = marketItems[collectionAddress][randomTokenNumber];

//     return winningItem.owner;
// }

// function getCollectionWinner(address collectionAddress) external view returns (address) {
//         return collectionWinners[collectionAddress];
//     }
// function checkUpkeep(bytes calldata checkData)
//     external
//     view
//     override
//     returns (bool upkeepNeeded, bytes memory performData)
// {
//     address collectionAddress = abi.decode(checkData, (address));
//     CollectionInfo memory info = collectionInfo[collectionAddress];
//     upkeepNeeded = (block.timestamp - info.lastTimeStamp) > info.updateInterval && info.allSold;
//     // Encode the requestId in the performData for later use in performUpkeep
//     performData = abi.encode(lotteryRequestIds[collectionAddress]);
    
//     return (upkeepNeeded, performData);
// }

// function performUpkeep(bytes calldata performData) external override {
//     uint256 requestId = abi.decode(performData, (uint256));
//     address collectionAddress = getCollectionAddress(requestId);
//     playLottery(collectionAddress, requestId);
// }


// // Helper function to retrieve the collection address from the requestId
// // function getCollectionAddress(uint256 requestId) internal view returns (address) {
// //     // You may need to adapt this based on how requestId is associated with the collection
// //     for (uint256 i = 0; i < CollectionAddresses.length; i++) {
// //         if (lotteryRequestIds[CollectionAddresses[i]] == requestId) {
// //             return CollectionAddresses[i];
// //         }
// //     }
// //     revert("Collection not found for the requestId");
// // }
// function getCollectionAddress(uint256 requestId) public view returns (address) {
//     // You may need to adapt this based on how requestId is associated with the collection
//     for (uint256 i = 0; i < CollectionAddresses.length; i++) {
//         if (lotteryRequestIds[CollectionAddresses[i]] == requestId) {
//             return CollectionAddresses[i];
//         }
//     }
//     revert("Collection not found for the requestId");
// }
//   function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
//         return IERC721Receiver.onERC721Received.selector;
//       }
//  function withdrawFunds(uint256 amount) external onlyOwner {
//         uint256 currentBalance = address(this).balance;
//         require(amount <=  currentBalance, "Insufficient funds");
//         currentBalance -= amount;
//         payable(msg.sender).transfer(amount);
//     }
//       receive() external payable {}

// }

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
    mapping(address => address) public collectionWinners;

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

    require(msg.value >= _totalPrice, "Not enough ether to cover item price and market fee");
    require(!item.sold, "Item already sold");

    // Transfer item base price to the seller
    // (bool successSeller, ) = item.seller.call{value: item.price}("");
    // require(successSeller, "Transfer to seller failed");
    item.sold = true; 
    item.escrowAmount += _totalPrice;
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

    // Calculate the winner's prize and transfer
    uint256 winnerPrize = (totalEscrowedAmount * info.winnerPercentage) / 100;
    transferPrizeToWinner(winner, winnerPrize);

    // Calculate and distribute remaining amount to the sellers
    distributeFundsToSellers(collectionAddress, totalEscrowedAmount, winnerPrize);
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

function transferPrizeToWinner(address winner, uint256 winnerPrize) private {
    uint256 winnerFee = calculateFee(winnerPrize);
    uint256 winnerAmountAfterFee = winnerPrize - winnerFee;
    
    (bool sent, ) = payable(winner).call{value: winnerAmountAfterFee}("");
    require(sent, "Failed to send Ether to winner");
}

function distributeFundsToSellers(address collectionAddress, uint256 totalEscrowedAmount, uint256 winnerPrize) private {
    uint256 totalSellerAmount = totalEscrowedAmount - winnerPrize;
    uint256 totalTokens = contractTokenIds[collectionAddress].length;

    for (uint256 i = 0; i < totalTokens; i++) {
        MarketItem storage item = marketItems[collectionAddress][i];
        if (item.sold) {
            uint256 sellerAmountBeforeFee = (item.escrowAmount * totalSellerAmount) / totalEscrowedAmount;
            uint256 sellerFee = calculateFee(sellerAmountBeforeFee);
            uint256 sellerAmountAfterFee = sellerAmountBeforeFee - sellerFee;
            
            if (sellerAmountAfterFee > 0) {
                (bool sent, ) = item.seller.call{value: sellerAmountAfterFee}("");
                require(sent, "Failed to send Ether to seller");
                item.escrowAmount = 0; // Clear escrow amount
            }
        }
    }
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
function checkUpkeep(bytes calldata checkData)
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory performData)
{
    address collectionAddress = abi.decode(checkData, (address));
    CollectionInfo memory info = collectionInfo[collectionAddress];
    upkeepNeeded = (block.timestamp - info.lastTimeStamp) > info.updateInterval && info.allSold;
    // Encode the requestId in the performData for later use in performUpkeep
    performData = abi.encode(lotteryRequestIds[collectionAddress]);
    
    return (upkeepNeeded, performData);
}

function performUpkeep(bytes calldata performData) external override {
    uint256 requestId = abi.decode(performData, (uint256));
    address collectionAddress = getCollectionAddress(requestId);
    playLottery(collectionAddress, requestId);
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
 function withdrawFunds(uint256 amount) external onlyOwner {
        uint256 currentBalance = address(this).balance;
        require(amount <=  currentBalance, "Insufficient funds");
        currentBalance -= amount;
        payable(msg.sender).transfer(amount);
    }
      receive() external payable {}

}