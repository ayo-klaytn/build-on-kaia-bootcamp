// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Deploy this contract on Kairos Testnet

// Importing OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// Importing Orakl contracts
import { IFeedProxy } from "@bisonai/orakl-contracts/v0.2/src/interfaces/IFeedProxy.sol";

contract Dynamos is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter public tokenIdCounter;

    // Create price feed
    IFeedProxy internal dataFeed;
    uint256 public lastPrice = 0;

    // Set variables for NFT
    string priceIndicatorUp = unicode"😀";
    string priceIndicatorDown = unicode"😔";
    string priceIndicatorFlat = unicode"😑";
    string public priceIndicator;

    string[] public colors = [ 
        "ff0000", // red
        "ffff00", // yellow
        "00ff00", // green
        "0000ff", // blue
        "00ffff", // cyan
        "808080", // gray
        "ff00ff"  // magenta
    ];
    uint8 public actualColor = 0;

    // Events
    event PriceUpdated(uint256 newPrice, uint256 oldPrice, string indicator);
    event NFTMinted(uint256 tokenId, address recipient);

    /**
     * Network: Kairos Testnet
     * Orakl Feed Proxy: 0xc2caa26226585f666ec79f8ecdb0aec17893af1d
     * Asset: KAIA/USD
     */
    constructor(address feedProxy) ERC721("Dynamos", "DYNAMO") {
        require(feedProxy != address(0), "Invalid feed proxy address");
        dataFeed = IFeedProxy(feedProxy);
        
        // Mint the first NFT
        safeMint();
    }

    function safeMint() public {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        updateSVG(tokenId);
        
        emit NFTMinted(tokenId, msg.sender);
    }

    // Update the SVG
    function updateSVG(uint256 tokenId) public {
        // Create the SVG string
        string memory finalSVG = buildSVG();
        
        // Base64 encode the SVG with enhanced metadata
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Dynamos #', tokenId.toString(), '",',
                        '"description": "Dynamic SVG NFT based on KAIA/USD price from Orakl Network",',
                        '"attributes": [',
                            '{"trait_type": "Price Indicator", "value": "', priceIndicator, '"},',
                            '{"trait_type": "Background Color", "value": "#', colors[actualColor], '"},',
                            '{"trait_type": "Last Price", "value": "', lastPrice.toString(), '"},',
                            '{"trait_type": "Oracle", "value": "Orakl Network"}',
                        '],',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSVG)),
                        '"}'
                    )
                )
            )
        );
        
        // Create token URI
        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        
        // Set token URI
        _setTokenURI(tokenId, finalTokenURI);
    }

    // Build the SVG string 
    function buildSVG() internal returns (string memory) {
        // Cycle through colors
        actualColor = (actualColor + 1) % uint8(colors.length);
        string memory fillColor = string(abi.encodePacked("#", colors[actualColor]));

        // Create SVG rectangle with color
        string memory headSVG = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='500' height='500' preserveAspectRatio='none' viewBox='0 0 500 500'>",
                "<rect width='100%' height='100%' fill='", fillColor, "' />"
            )
        );
        
        // Add price indicator emoji and price display
        string memory bodySVG = string(
            abi.encodePacked(
                "<text x='50%' y='40%' font-size='128' dominant-baseline='middle' text-anchor='middle'>",
                comparePrice(),
                "</text>",
                "<text x='50%' y='70%' font-size='24' dominant-baseline='middle' text-anchor='middle' fill='black'>",
                "KAIA/USD: $", formatPrice(lastPrice),
                "</text>"
            )
        );
        
        // Close SVG
        string memory tailSVG = "</svg>";

        // Concatenate SVG strings
        return string(abi.encodePacked(headSVG, bodySVG, tailSVG));
    }

    // Compare new price to previous price
    function comparePrice() public returns (string memory) {
        uint256 currentPrice = getOraklDataFeedLatestAnswer();
        uint256 oldPrice = lastPrice;
        
        if (currentPrice > lastPrice) {
            priceIndicator = priceIndicatorUp;
        } else if (currentPrice < lastPrice) {
            priceIndicator = priceIndicatorDown;
        } else {
            priceIndicator = priceIndicatorFlat;
        }
        
        lastPrice = currentPrice;
        emit PriceUpdated(currentPrice, oldPrice, priceIndicator);
        
        return priceIndicator;
    }

    // Get latest price from Orakl Network
    function getOraklDataFeedLatestAnswer() public view returns (uint256) {
        (, int256 answer ,) = dataFeed.latestRoundData();
        return uint256(answer);
    }

    // Format price for display (assumes 8 decimal places)
    function formatPrice(uint256 price) internal pure returns (string memory) {
        if (price == 0) return "0.00";
        
        // Convert to 2 decimal places for display
        uint256 dollars = price / 1e8;
        uint256 cents = (price % 1e8) / 1e6;
        
        return string(abi.encodePacked(
            dollars.toString(),
            ".",
            cents < 10 ? "0" : "",
            cents.toString()
        ));
    }


    // Get the raw latest round data from Orakl
    function getLatestRoundData() external view returns (uint80 roundId, int256 answer, uint256 updatedAt) {
        return dataFeed.latestRoundData();
    }

    // The following functions are overrides required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}