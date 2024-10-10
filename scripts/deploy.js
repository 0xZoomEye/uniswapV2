const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  /**
   * 部署 UniswapV2
   */
  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address); // 设置 _feeToSetter 为 deployer
  console.log("UniswapV2Factory deployed to:", factory.target);

  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();
  console.log("WETH deployed to:", weth.target); 

  await weth.deposit({value: ethers.parseEther("50")});

  const deployerBalance1 = await weth.balanceOf(deployer.address);
  console.log("Deployer's WETH balance:", ethers.formatEther(deployerBalance1));

  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.target, weth.target); 
  console.log("UniswapV2Router02 deployed to:", router.target); 

  /**
   * 创建 erc 20 代币 添加流动性
   */
  // 创建 erc 20 代币
  const ERC20 = await ethers.getContractFactory("MoneyStory");
  const erc20 = await ERC20.deploy();
  console.log("ERC20 deployed to:", erc20.target);

  const deployerBalance = await erc20.balanceOf(deployer.address);
  console.log("Deployer's ERC20 balance:", ethers.formatEther(deployerBalance));

  // 创建 pair
  const pair = await factory.createPair(erc20.target, weth.target);
  console.log("Pair deployed to:", pair);

  const approveTx = await erc20.approve(router.target, ethers.parseEther("100000"));
  await approveTx.wait();

  const allowance = await erc20.allowance(deployer.address, router.target);
  console.log("Allowance:", ethers.formatEther(allowance));

  const approveTx1 = await weth.approve(router.target, ethers.parseEther("1000"));
  await approveTx1.wait();

  const allowance1 = await weth.allowance(deployer.address, router.target);
  console.log("allowance1:", ethers.formatEther(allowance1));

  // 添加流动性
  const addLiquidity = await router.addLiquidity(
    erc20.target,
    weth.target,
    // erc20.target.balanceOf(deployer.target),
    // weth.target.balanceOf(deployer.target),
    // erc20.target.balanceOf(deployer.target),
    // weth.target.balanceOf(deployer.target),
    ethers.parseEther("10"),
    ethers.parseEther("10"),
    ethers.parseEther("10"),
    ethers.parseEther("10"),
    deployer.address,
    Math.floor(Date.now() / 1000) + 10*60, // 10 minutes from now
  );
  console.log("Add liquidity:", addLiquidity);

}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
