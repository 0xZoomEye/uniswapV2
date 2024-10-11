# Uniswap V2
合约代码均来自 Uniswap V2, 在原始代码上适配的 hardhat 编译，同时在里面添加了 console.log 方便调试。在调试过程中最重要的一步就是修改 init code hash。 该仓库 clone 后可以正常执行，如果涉及到修改 pair 代码，则需要走 init code hash 的计算。

## 计算 init code hash
1. `npm run clean`
2. `npm run compile`
3. `npm run fix` 将计算出来的 init code hash 填入 pairFor 函数中

## 启动 hardhat node
`npx hardhat node`

## 部署合约
`npx hardhat run deploy`

## 测试交易
`node run swap`