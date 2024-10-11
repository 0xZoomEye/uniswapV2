const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  const [_, account2] = await ethers.getSigners();

  const tokenA = config.weth; // Address of WETH
  const tokenB = config.erc20; // Address of the token to receive

  const tokenBContract = await ethers.getContractAt("MoneyStory", config.erc20);

  let tokenABalance = await ethers.provider.getBalance(account2.address);
  let tokenBBalance = await tokenBContract.balanceOf(account2.address);

  console.log("账户2 ETH 余额:", ethers.formatEther(tokenABalance));
  console.log("账户2 tokenB 余额:", ethers.formatEther(tokenBBalance));

  const routerAddress = config.router;
  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = Router.attach(routerAddress);

  const amountIn = ethers.parseEther("10"); // Amount of ETH to swap
  const amountOutMin = 0; // 在生产环境中应该计算这个值
  const path = [tokenA, tokenB];
  const to = account2.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  console.log("Swapping ETH for tokens...");

  const tx = await router.connect(account2).swapExactETHForTokens(
    amountOutMin,
    path,
    to,
    deadline,
    { value: amountIn }
  );
  const receipt = await tx.wait();
  console.log("Swap completed. Transaction hash:", receipt.hash);

  tokenABalance = await ethers.provider.getBalance(account2.address);
  tokenBBalance = await tokenBContract.balanceOf(account2.address);

  console.log("账户2 ETH 余额:", ethers.formatEther(tokenABalance));
  console.log("账户2 tokenB 余额:", ethers.formatEther(tokenBBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
