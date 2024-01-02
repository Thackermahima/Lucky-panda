// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFT is ERC721{
        uint256 private _tokenIdCounter;
        address marketlaceAddress;
      constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}
    
   function safeMint (address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
           _safeMint(to, tokenId);    
          _tokenIdCounter++;
          return tokenId;
    }
}