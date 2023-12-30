// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import './NFT.sol';

contract Marketplace is Ownable(msg.sender), ReentrancyGuard{ 

    mapping (address => address[]) private tokens;
    mapping (address => uint256[] ) contractTokenIds;
    mapping (address => uint256) collectionsOfTokenId;
    mapping (uint256 => MarketItem) public marketItems;
    mapping (address => string) collections;

    address payable public feeAccount =  payable(address(this));
    address[] public CollectionAddresses;
    uint256 public feePercent = 2;
    uint public getNFTCount; 
    uint256 private _ItemIdsCounter;
    uint256[] public allSoldItems;

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

    function createToken(string memory name, string memory symbol) public {
       address _address = address(new NFT(name, symbol, address(this)));   
        uint256 count = 0;
       tokens[msg.sender].push(_address);
       CollectionAddresses.push(_address);
       count++;       
        emit TokenCreated(msg.sender, _address);
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
        collectionsOfTokenId[tokenAddress] = tokenId;
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
        uint256 itemId = _ItemIdsCounter;
        marketItems[itemId] = MarketItem(
            itemId,
            nftContractAddress,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        _ItemIdsCounter++;

        IERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

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
    uint256 _totalPrice = getTotalPrice(tokenId);
    MarketItem storage item = marketItems[tokenId];

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

    marketItems[tokenId].owner = payable(msg.sender);
    allSoldItems.push(tokenId);
    emit Bought(item.itemId, nftContract, item.tokenId, item.price, item.seller, msg.sender);
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

  function getCollectionTokenId(address collectionContract) public view returns(uint256){
        return collectionsOfTokenId[collectionContract];
    }
  
  function getAllContractAddresses() public view returns(address[] memory) {
   return CollectionAddresses;
  }
  
  function getAllSoldItems() external view returns (uint256[] memory) {
        return allSoldItems;
    }

  function getTotalPrice(uint256 tokenId) public view returns (uint256) {
        return ((marketItems[tokenId].price * (100 + feePercent)) / 100);
    }
  function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
      }

      receive() external payable {}

}