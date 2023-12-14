// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "./comman/ERC721.sol";

contract LotteryEscrow is ERC721, VRFConsumerBaseV2, AutomationCompatibleInterface{
    uint256 private _tokenIdCounter;
    uint256 public feePercent = 2; //the fee percntage on sales
    address payable public feeAccount;
    mapping(uint256 => MarketItem) public marketItems;
    mapping(uint256 => address payable) public OwnerOfAnNFT;
    mapping(address => uint256[]) public soldItems;
    address payable public winner;
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    mapping(address => uint256) public addressToRequestId;
    VRFCoordinatorV2Interface COORDINATOR;
    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    struct MarketItem {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );
    event Bought(
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
    //   bytes32 keyHash =
    //     0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
     event RandomnessRequestSent(uint256 requestId, uint32 numWords);
    event RandomnessRequestFulfilled(uint256 requestId, uint256[] randomWords);


    bytes32 public keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;
    uint256 public immutable interval;
    uint256 public lastTimeStamp;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 updateInterval,
        address vrfCoordinator,
        bytes32 vrfKeyHash,
        uint64 subscriptionId
    ) ERC721(_name, _symbol) 
      VRFConsumerBaseV2(vrfCoordinator) 
    {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        keyHash = vrfKeyHash;
        s_subscriptionId = subscriptionId;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    }
   


    function safeMint(address payable to, uint256 price) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
         require(OwnerOfAnNFT[tokenId] == address(0), "The tokenId is already taken");
        // Store the owner of the tokenId or NFT
            OwnerOfAnNFT[tokenId] = to;
           _safeMint(msg.sender, tokenId);
            marketItems[tokenId] = MarketItem(
            address(this),
            tokenId,
            payable(to),
            payable(address(0)),
            price,
            false
        );
        _tokenIdCounter++;
        emit MarketItemCreated(address(this), tokenId, to, address(0), price);
        return tokenId;
    }
         
         function requestRandomWords()
        external
        returns (uint256 requestId)
    {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }
  function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

   function playLottery() public {
    require(address(this).balance > 0, "No funds available for transfer");
    
    uint256 randomTokenId = getRandomTokenId(msg.sender);
    require(randomTokenId < _tokenIdCounter, "Invalid random token ID");

        RequestStatus memory requestStatus = getRandomnessRequestState(msg.sender);
    require(requestStatus.fulfilled, "Randomness request not fulfilled");


    winner = OwnerOfAnNFT[randomTokenId];
    require(winner != address(0), "Winner address is invalid");
    
    payable(winner).transfer(address(this).balance);
}

  function getRandomnessRequestState(address requester)
        public
        view
        returns (RequestStatus memory)
    {
        return s_requests[addressToRequestId[requester]];
    }
  function getRandomTokenId(address requester)
        public
        view
        returns (uint256 randomTokenId)
    {
    RequestStatus memory requestStatus = getRandomnessRequestState(requester);
    
    require(requestStatus.fulfilled, "Request not fulfilled");
    uint256 randomWord = requestStatus.randomWords[0];
     if (_tokenIdCounter > 0) {
        randomTokenId = randomWord % _tokenIdCounter;
    } else {
        revert("No tokens minted yet");
    }
     return randomTokenId;
}

function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }
function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
           playLottery();
        }
    }
    function transferTokens(
        address from,
        address payable to,
        address token,
        uint256 amount
    ) public {
        if (token != address(0)) {
            IERC721(token).transferFrom(from, to, amount);
        } else {
            require(to.send(amount), "Transfer of ETH to receiver failed");
        }
    }
    function purchaseItem(uint256 tokenId, address collectionContract) external payable {
        MarketItem memory item = marketItems[tokenId];
        require(!item.sold, "item already sold");
        IERC721(item.nftContract).approve(msg.sender, tokenId);
        payable(item.seller).transfer(msg.value);
        item.sold = true; 
        IERC721(item.nftContract).transferFrom(item.seller, msg.sender, tokenId);
        marketItems[tokenId].owner = payable(msg.sender);
        soldItems[collectionContract].push(tokenId);
        emit Bought(address(this), item.tokenId, msg.value, item.seller, msg.sender);
    } 

    function getPurchaseItem(address  collectionContract) public view returns(uint256[] memory){
        return soldItems[collectionContract];
    }
    function getTotalPrice(uint256 tokenId) public view returns (uint256) {
        return ((marketItems[tokenId].price * (100 + feePercent)) / 100);
    }
} 