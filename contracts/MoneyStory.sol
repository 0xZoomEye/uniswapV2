pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MoneyStory is ERC20 {
    constructor() ERC20("Moneystory", "MS") public {
      uint256 initialSupply = 1000000000 * 10**18; // 1 billion tokens with 18 decimal places
      _mint(msg.sender, initialSupply);
    }
}