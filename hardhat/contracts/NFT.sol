// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract NFT is ERC721{

    uint256 private _tokenIdCounter;
    // uint32 public callbackGasLimit = 100000;
    // uint16 public requestConfirmations = 3;
    // uint32 public numWords = 1;
    uint256 public immutable interval;
    uint256 public lastTimeStamp;
    uint256 public winnerPercentage;

    // uint64 s_subscriptionId;
    // bytes32 keyHash;
   
    // VRFCoordinatorV2Interface COORDINATOR;


    // event RequestSent(uint256 requestId, uint32 numWords);
    // event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    //  struct RequestStatus {
    //     bool fulfilled; // whether the request has been successfully fulfilled
    //     bool exists; // whether a requestId exists
    //     uint256[] randomWords;
    // }
    // mapping(uint256 => RequestStatus)
    //     public s_requests; /* requestId --> requestStatus */

    // mapping(address => uint256) public addressToRequestId;
    //  // past requests Id.
    // uint256[] public requestIds;
    // uint256 public lastRequestId;
    // address marketplaceOwner;
      constructor(
           string memory _name,
        string memory _symbol,
        uint256 _updateInterval,
        uint256 _winnerPercentage
    

        )
        ERC721(_name, _symbol)
    {
        interval = _updateInterval;
        lastTimeStamp = block.timestamp;
        winnerPercentage = _winnerPercentage;
     
    }

    //    modifier onlyMarketplaceOwner {
    //     require(msg.sender == marketplaceOwner, "Only Marketplace owner can call this function");
    //     _;
    // }

  
   function safeMint (address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
           _safeMint(to, tokenId);    
          _tokenIdCounter++;
          return tokenId;
    }
//       function getRequestStatus(
//         uint256 _requestId
//     ) external view returns (bool fulfilled, uint256[] memory randomWords) {
//         require(s_requests[_requestId].exists, "request not found");
//         RequestStatus memory request = s_requests[_requestId];
//         return (request.fulfilled, request.randomWords);
//     }

//      function getRandomnessRequestState(address requester)
//         public
//         view
//         returns (RequestStatus memory)
//     {
//         return s_requests[addressToRequestId[requester]];
//     }

//     function requestRandomWords()
//         external 
//         onlyMarketplaceOwner
//         returns (uint256 requestId)
//     {
//         requestId = COORDINATOR.requestRandomWords(
//             keyHash,
//             s_subscriptionId,
//             requestConfirmations,
//             callbackGasLimit,
//             numWords
//         );
//         s_requests[requestId] = RequestStatus({
//             randomWords: new uint256[](0),
//             exists: true,
//             fulfilled: false
//         });
//         requestIds.push(requestId);
//         lastRequestId = requestId;
//         emit RequestSent(requestId, numWords);
//         return requestId;
//     }
//       function getRandomTokenId(address requester)
//         public
//         view
//         returns (uint256 randomTokenId)
//     {
//     RequestStatus memory requestStatus = getRandomnessRequestState(requester);
    
//     require(requestStatus.fulfilled, "Request not fulfilled");
//     uint256 randomWord = requestStatus.randomWords[0];
//      if (_tokenIdCounter > 0) {
//         randomTokenId = randomWord % _tokenIdCounter;
//     } else {
//         revert("No tokens minted yet");
//     }
//      return randomTokenId;
// }
//   function fulfillRandomWords(
//         uint256 _requestId,
//         uint256[] memory _randomWords
//     ) internal override {
//         require(s_requests[_requestId].exists, "request not found");
//         s_requests[_requestId].fulfilled = true;
//         s_requests[_requestId].randomWords = _randomWords;
//         emit RequestFulfilled(_requestId, _randomWords);
    //}
}