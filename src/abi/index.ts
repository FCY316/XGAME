import { Interface, InterfaceAbi } from "ethers";
import { tokenAddress } from "./tokenAddress";

type objKeyObjectType = {
  [key: string]: { address: string; abi: Interface | InterfaceAbi };
};
const Pool = require("@/abi/Pool.json");
const erc20 = require("@/abi/erc20.json");
const UniswapV2Pair = require("@/abi/UniswapV2Pair.json");

let contract: objKeyObjectType = {
  // 合约
  Pool: { abi: Pool, address: "" },
  erc20: { abi: erc20, address: "" },
  UniswapV2Pair: { abi: UniswapV2Pair, address: "" },
};
if (process.env.NODE_ENV === "development") {
  //开发环境
  contract.Pool.address = "0x8905FE51a10cE3183538A725674CddAF35e9F4A4";
  contract.erc20.address = tokenAddress["AWW"];
  contract.UniswapV2Pair.address = "0xda92e22463f655310d2438295f64c46ec4540d73";
} else {
  //生产环境
  contract.Pool.address = "0x8905FE51a10cE3183538A725674CddAF35e9F4A4";
  contract.erc20.address = tokenAddress["AWW"];
  contract.UniswapV2Pair.address = "0xda92e22463f655310d2438295f64c46ec4540d73";
}
export default contract;
