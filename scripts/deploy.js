const fs = require("fs");
const { ethers } = require("hardhat");

const config = {};
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("部署者地址:", deployer.address);

  // 获取部署者的 ETH 余额
  const deployerEthBalance = await ethers.provider.getBalance(deployer.address);
  console.log("ETH余额:", ethers.formatEther(deployerEthBalance));

  /**
   * 部署 UniswapV2
   */
  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address); // 设置 _feeToSetter 为 deployer
  console.log("工厂地址", factory.target);

  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();
  console.log("WETH 地址", weth.target); 
  Object.assign(config, {
    weth: weth.target,
  });


  let deployerWethBalance = await weth.balanceOf(deployer.address);
  console.log("WETH 余额", ethers.formatEther(deployerWethBalance));

  if (ethers.formatEther(deployerWethBalance) == 0) {
    const depositTx = await weth.deposit({ value: ethers.parseEther("500") });
    await depositTx.wait();

    deployerWethBalance = await weth.balanceOf(deployer.address);
    console.log("WETH 余额", ethers.formatEther(deployerWethBalance));

    const deployerEthBalance = await ethers.provider.getBalance(deployer.address);
    console.log("ETH余额:", ethers.formatEther(deployerEthBalance));
  }

  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.target, weth.target); 
  console.log("路由地址", router.target); 
  Object.assign(config, {
    router: router.target,
  });

  /**
   * 创建 erc 20 代币 添加流动性
   */
  // 创建 erc 20 代币
  const ERC20 = await ethers.getContractFactory("MoneyStory");
  const erc20 = await ERC20.deploy();
  console.log("新代币地址", erc20.target);
  Object.assign(config, {
    erc20: erc20.target,
  });

  const deployerBalance = await erc20.balanceOf(deployer.address);
  console.log("新代币余额", ethers.formatEther(deployerBalance));

  // 创建 pair
  const pair = await factory.createPair(erc20.target, weth.target);
  console.log("创建币对", pair.hash);

  // 授权
  const approveERC20Tx = await erc20.approve(router.target, deployerBalance);
  await approveERC20Tx.wait();
  console.log("将新代币授权给路由");

  const allowanceERC20 = await erc20.allowance(deployer.address, router.target);
  console.log("新代币授权给路由数量", ethers.formatEther(allowanceERC20));

  const approveWETHTx = await weth.approve(router.target, deployerWethBalance);
  await approveWETHTx.wait();
  console.log("将WETH授权给路由");
  const allowanceWETH = await weth.allowance(deployer.address, router.target);
  console.log("WETH授权给路由数量", ethers.formatEther(allowanceWETH));

  // 添加流动性
  // 在添加流动性时传入四个数值的原因:
  
  // 1. amountADesired 和 amountBDesired:
  // 这两个参数表示用户希望添加的两种代币的最大数量。
  // 它们代表了用户愿意投入流动性池的最大额度。
  
  // 2. amountAMin 和 amountBMin:
  // 这两个参数表示用户能接受的最小添加数量。
  // 它们是为了防止在交易被打包过程中价格发生剧烈变化而设置的。
  
  // 使用这四个参数的原因:
  // - 灵活性: 允许用户设定期望范围,而不是固定数值
  // - 滑点保护: 最小值可以保护用户免受大幅价格波动的影响
  // - 最优化: 合约可以根据当前池子状况,在这个范围内选择最优的添加比例
  // - 公平性: 确保用户获得的流动性代币数量与其贡献相匹配
  
  // 总之,这种设计既保护了用户利益,又为系统提供了优化空间。
  const addLiquidity = await router.addLiquidity(
    erc20.target,
    weth.target,
    ethers.parseEther("100"),
    ethers.parseEther("100"),
    ethers.parseEther("100"),
    ethers.parseEther("100"),
    deployer.address,
    Math.floor(Date.now() / 1000) + 10*60, // 10 minutes from now
  );
  console.log("添加流动性", addLiquidity.hash);
}

main()
.then(() => {
  fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
  process.exit(0)
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});
