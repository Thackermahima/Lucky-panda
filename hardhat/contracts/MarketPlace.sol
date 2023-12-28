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

    address[] public CollectionAddresses;
    
    uint public getNFTCount; 
    uint256 private _ItemIdsCounter;
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
    uint256 tokenId,
    uint256 price
) public  nonReentrant{
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
    IERC721(nftContractAddress).transferFrom(msg.sender, address(this), tokenId);
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