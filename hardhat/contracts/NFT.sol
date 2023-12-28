// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFT is ERC721{
        uint256 private _tokenIdCounter;
        address marketlaceAddress;
      constructor(string memory _name, string memory _symbol, address _marketplaceAddress)
        ERC721(_name, _symbol)
    {
        marketlaceAddress = _marketplaceAddress;
    }
    
   function safeMint (address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
           _safeMint(to, tokenId);    
            setApprovalForAll(marketlaceAddress, true);
          _tokenIdCounter++;
          return tokenId;
    }
}