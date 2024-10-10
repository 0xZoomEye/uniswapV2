const hre = require("hardhat");

async function main() {
  const [deployer, account2] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 创建 erc 20 代币
  const ERC20 = await hre.ethers.getContractFactory("MoneyStory");
  const erc20 = await ERC20.deploy();
  console.log("ERC20 deployed to:", erc20.target);

  // await erc20.mint(deployer.address, 1000000000);
  // 查询 deployer 的 balance
  const deployerBalance = await erc20.balanceOf(deployer.address);
  console.log("Deployer's ERC20 balance:", hre.ethers.formatEther(deployerBalance));

  // 转账 100 个 ERC20 代币给 account2
  const transferAmount = hre.ethers.parseEther("100");
  await erc20.transfer(account2.address, transferAmount);
  console.log("Transferred 100 ERC20 tokens to:", account2.address);

  // 查询 account2 的 ERC20 余额
  const account2Balance = await erc20.balanceOf(account2.address);
  console.log("Account2's ERC20 balance:", hre.ethers.formatEther(account2Balance));
  
  // 查询 deployer 的 ETH balance
  const ethBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer's ETH balance:", hre.ethers.formatEther(ethBalance));
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
