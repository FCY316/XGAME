import { Interface, InterfaceAbi } from "ethers";
import { tokenAddress } from "./tokenAddress";

type objKeyObjectType = {
  [key: string]: { address: string; abi: Interface | InterfaceAbi };
};
const Pool = require("@/abi/Pool.json");
const erc20 = require("@/abi/erc20.json");

let contract: objKeyObjectType = {
  // 合约
  Pool: { abi: Pool, address: "" },
  erc20: { abi: erc20, address: "" },
};
if (process.env.NODE_ENV === "development") {
  //开发环境
  contract.Pool.address = "0x4a52E70F4020FAF0edcC4Ab01268B45e3AdeaEb3";
  contract.erc20.address = tokenAddress["AWW"];
} else {
  //生产环境
  contract.Pool.address = "0x4a52E70F4020FAF0edcC4Ab01268B45e3AdeaEb3";
  contract.erc20.address = tokenAddress["AWW"];
}
export default contract;
