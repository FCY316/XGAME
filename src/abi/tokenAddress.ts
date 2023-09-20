import { stringKey } from "@/interface";
import nest from "@/image/nest.png";
import fibo from "@/image/fibo.png";
import aww from "@/image/aww.png";
import vtt from "@/image/vtt.png";
import adf from "@/image/adf.png";
// 会改的合约
export const tokenAddress: stringKey = {
  FIBO: "xxx",
  AWW: "xxx",
  NEST: "xxx",
  ADF: "xxx",
  VTT: "xxx",
};
// logo
export const logoList: stringKey = {
  FIBO: fibo,
  AWW: aww,
  NEST: nest,
  ADF: adf,
  VTT: vtt,
};
export const getPriceAddress = {
  tokenInAddressAWW: "xxx", // 输入代币地址
  tokenInAddressWFIBO: "xxx", // 输入代币地址
  tokenOutAddressUSDT: "xxx", // 输出代币地址
};
