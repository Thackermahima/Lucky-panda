// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./comman/ERC721.sol";

contract mintContract is ERC721 {
    uint256 private _tokenIdCounter;
    uint256 public feePercent = 2; //the fee percntage on sales
    address payable public feeAccount;
    mapping(uint256 => MarketItem) public marketItems;

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

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function safeMint(address to, uint256 price) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
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

    function purchaseItem(uint256 tokenId, address to) external payable {
        uint256 _totalPrice = getTotalPrice(tokenId);
        MarketItem memory item = marketItems[tokenId];
        require(
            msg.value >= _totalPrice,
            "not enough matic to cover item price and market fee"
        );
        require(!item.sold, "item already sold");

        item.seller.transfer(item.price);
        item.sold = true;
        IERC721(item.nftContract).transferFrom(item.seller, to, tokenId);
        marketItems[tokenId].owner = payable(to);

        emit Bought(address(this), item.tokenId, item.price, item.seller, to);
    }

    function getTotalPrice(uint256 tokenId) public view returns (uint256) {
        return ((marketItems[tokenId].price * (100 + feePercent)) / 100);
    }
}
