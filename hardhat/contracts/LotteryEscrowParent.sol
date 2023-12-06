// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./LotteryEscrow.sol";
 contract LotteryEscrowParent is Ownable(msg.sender),IERC721Receiver{
  event TokenCreated(address, address);
    event TokenTransfered(address, address, address, uint256);
    uint public getNFTCount; 
    uint getAddressCount;
    mapping(address => address[]) private tokens;
    // mapping(address => uint256[]) counts;
    mapping (address => uint256[] ) contractTokenIds;
    mapping (address => string) collections;
    mapping (address => uint256) collectionsOfTokenId;
    address vrfCoordinator = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
        bytes32 vrfKeyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
        uint64 subscriptionId = 7485;
    function createToken(string memory name, string memory symbol) public {
        address _address = address(new LotteryEscrow(name, symbol, vrfCoordinator, vrfKeyHash, subscriptionId ));
       uint256 count = 0;
       tokens[msg.sender].push(_address);
       count++;       
        emit TokenCreated(msg.sender, _address);
    }
    function setCollectionUri(address collectionContract, string memory uri) public{
            collections[collectionContract] = uri;
    }
    function getCollectionUri(address collectionContract) public view returns(string memory){
       return collections[collectionContract];
    }
    function getCollectionTokenId(address collectionContract) public view returns(uint256){
        return collectionsOfTokenId[collectionContract];
    }
    function bulkMintERC721(
        //address payable mintor,
        address payable tokenAddress,
        uint256 start,
        uint256 end,
        uint256 price
    ) public {
         uint256 count = 0;
        for (uint256 i = start; i < end; i++) {
         uint256 tokenId =  LotteryEscrow(tokenAddress).safeMint(payable(msg.sender), price);
        contractTokenIds[tokenAddress].push(tokenId);
        collectionsOfTokenId[tokenAddress] = tokenId;
                          count++;             
            }         
        getNFTCount = count;
   } 
function getContractAddresses() public view returns(address[] memory) {
  return tokens[msg.sender];
}
function getAllTokenId(address tokenContractAddress) public view returns (uint[] memory){
    uint[] memory ret = new uint[](getNFTCount);
    for (uint i = 0; i < getNFTCount; i++) {
        ret[i] = contractTokenIds[tokenContractAddress][i];
    } 
    return ret;
}


      function callPurchaseItem(
         uint256 tokenId,
         address tokenAddress,
         address collectionContract
      )public payable{
          IERC721(tokenAddress).getApproved(tokenId) == tokenAddress;
        require(msg.sender == IERC721(tokenAddress).ownerOf(tokenId), "caller is not token owner");
        LotteryEscrow(tokenAddress).purchaseItem{value: msg.value}(tokenId,collectionContract);
      }
      function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
      }
    function transferToken(
        address from,
        address payable to,
        address  token,
        uint256 amount
    ) public {
        LotteryEscrow(token).transferTokens(from, to, token, amount);
        emit TokenTransfered(from, to, token, amount);
    }
}