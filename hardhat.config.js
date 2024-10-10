require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.4.18",
      },
    ],
    // 不能自动识别版本，需要手动指定
    overrides: {
      "contracts/UniswapV2Pair.sol": {
        version: "0.5.16",
      },
      "contracts/UniswapV2Factory.sol": {
        version: "0.5.16",
      },
      "contracts/UniswapV2ERC20.sol": {
        version: "0.5.16",
      },
    },

    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // 解决合约过大问题
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 70000000
    },
    localhost: {
        url: "http://127.0.0.1:8545", // Ganache 默认端口
    },
  },
};
