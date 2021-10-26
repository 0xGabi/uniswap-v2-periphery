const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const UniswapV2Router01 = artifacts.require("UniswapV2Router01");
const Factory = artifacts.require("IUniswapV2Factory")
const ERC20 = artifacts.require("ERC20")
const WETH = artifacts.require("WETH9")
const IncentivisedSlidingWindowOracle = artifacts.require("IncentivisedSlidingWindowOracle")

// xDAI
// const FACTORY_ADDRESS = "0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7"
// const HNY = "0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
// const DAI = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"

// xDAI Test
// const UNISWAP_V2_ROUTER_02 = "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77"
// const HNY = "0x6F937495013C7DC42aF752d3E0BcC090bd34F7AB"
// const DAI = "0x09327b72157cFe804FEEe57dfCEb50A0CA1Af26a"

// Rinkeby
// const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
// const UNISWAP_V2_ROUTER_02 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
// const HNY = "0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9"
// const DAI = "0x531eab8bB6A2359Fe52CA5d308D85776549a0af9"

// Arbtest
const FACTORY_ADDRESS = "0xC7120Cb97283B5527a24fD5b9971c6deB362f08E"
const UNISWAP_V2_ROUTER_02 = "0x0Fe2d157c5f1334eDd687d045143CE4b36f88040"
const HNY = "0x0Ea93430B405595e7ae22b1D4BBedED0DDA13b2E"
const DAI = "0x205F76D6dDD95D7bA53b131506EA851B04568899"

const toBn = (value) => new web3.utils.toBN(value)
const toBnWithDecimals = (x, y = 18) => toBn((toBn(x).mul(toBn(10).pow(toBn(y)))).toString())
const TWO_PERCENT = toBnWithDecimals(2, 16)

module.exports = async (deployer) => {

  const hny = await ERC20.at(HNY)
  console.log(`Honey: ${hny.address}`)

  const wxdai = await ERC20.at(DAI)
  console.log(`xDAI: ${wxdai.address}`)

  const uniswapV2Router02 = await UniswapV2Router02.at(UNISWAP_V2_ROUTER_02)

  // console.log(`Approving hny for liquidity...`)
  // await hny.approve(uniswapV2Router02.address, toBnWithDecimals(9999999999999))
  // console.log(`Approving wxdai for liquidity...`)
  // await wxdai.approve(uniswapV2Router02.address, toBnWithDecimals(9999999999999))

  // console.log(`Adding liquidity...`)
  // await uniswapV2Router02.addLiquidity(hny.address, wxdai.address, toBnWithDecimals(1000000), toBnWithDecimals(300000),
  //   0, 0, (await web3.eth.getAccounts())[0], toBn(99999999999999999999))

  const windowSize = 86400 // 24 hours
  const granularity = 8 // 3 hours each period

  console.log(`Deploying incentivised price oracle...`)
  const factory = await Factory.at(FACTORY_ADDRESS)
  const incentivisedPair = await factory.getPair(HNY, DAI)
  const priceOracle = await deployer.deploy(IncentivisedSlidingWindowOracle, FACTORY_ADDRESS, windowSize,
    granularity, HNY, TWO_PERCENT, incentivisedPair)

  console.log(`Transfer incentive token to oracle...`)
  // await (await ERC20.at("0x6a2D6EeA302e7C4c8Abe3b4F04FdB2443459283A")).transfer(toBnWithDecimals(1), priceOracle.address)
  await hny.transfer(priceOracle.address, toBnWithDecimals(1))
};
