// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Sample implementation of a PERC721 contract (Private ERC721).
 */
contract PERC721 is ERC721, Ownable {
    uint256 private _currentTokenId = 0;

    constructor (address initialOwner) ERC721("Sample PERC721", "pNFT") Ownable (initialOwner) {}

    /// @dev Mint a new token to the caller (private NFT minting).
    function mint() public payable {
        require(msg.sender == tx.origin, "PERC721: Contracts cannot mint");

        uint256 newTokenId = _currentTokenId;
        _safeMint(msg.sender, newTokenId);
        _currentTokenId++;
    }

    /**
     * @dev Regular `balanceOf` function, modified for privacy.
     */
    function balanceOf(address account) public view override returns (uint256) {
        require(msg.sender == account, "PERC721: msg.sender != account");
        return super.balanceOf(account);
    }

}

