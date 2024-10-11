const ethers = require('ethers');

const {bytecode} = require("../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json");
function calculateKeccak256(input) {
    // Check if the input starts with '0x'
    if (!input.startsWith('0x')) {
        throw new Error('Input must start with 0x');
    }

    // Remove '0x' prefix if present
    const cleanInput = input.startsWith('0x') ? input.slice(2) : input;

    // Check if the remaining string is valid hexadecimal
    if (!/^[0-9A-Fa-f]+$/.test(cleanInput)) {
        throw new Error('Input must be a valid hexadecimal string');
    }

    // Calculate Keccak-256 hash
    const hash = ethers.keccak256('0x' + cleanInput);

    // Return the hash without '0x' prefix and in lowercase
    return hash.slice(2).toLowerCase();
}

// Example usage:
const result = calculateKeccak256(bytecode); // 
console.log(result);

// 将计算出来的init code hash 填入 pairFor 函数中
// function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {
//   (address token0, address token1) = sortTokens(tokenA, tokenB);
  
//   pair = address(uint(keccak256(abi.encodePacked(
//           hex'ff',
//           factory,
//           keccak256(abi.encodePacked(token0, token1)),
//           hex'2e6485e278d5244ab85e51bf30dd237cefc3d645b8c79ac93ad178b75722b754' // init code hash
//           ))));
// }