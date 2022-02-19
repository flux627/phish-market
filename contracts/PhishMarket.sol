import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract PhishMarket is ERC721URIStorage {

    address public immutable owner;
    uint256 public totalSupply;
    string private uriPrefix;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        owner = msg.sender;
        uriPrefix = 'ipfs://';
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal view override returns (string memory) {
        return uriPrefix;
    }

    function mint(string memory metadataCid) public {
        require(msg.sender == owner, "only owner");
        _mint(msg.sender, totalSupply++);
        _setTokenURI(totalSupply-1, metadataCid);
    }

    function updateMetadataCid(uint256 tokenId, string memory metadataCid) public {
        require(msg.sender == owner, "only owner");
        _setTokenURI(tokenId, metadataCid);
    }

    function withdraw() public {
        require(msg.sender == owner, "only owner");
        payable(owner).transfer(address(this).balance);
    }
}
