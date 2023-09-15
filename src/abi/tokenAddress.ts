import { stringKey } from "@/interface";
import nest from '@/image/nest.png'
import fibo from '@/image/fibo.png'
import aww from '@/image/aww.png'
import vtt from '@/image/vtt.png'
import adf from '@/image/adf.png'
// 会改的合约
export const tokenAddress: stringKey = {
  FIBO: "",
  AWW: "0x9014d93437b537481f9df5c72eb7e9d84869c0f4",
  NEST: "0xC7b58794B2806C49ED0c5bFd8B1470b06066EA08",
  ADF: "0x4AA69efc685d75C5c490E6e89984890a4AF8844F",
  VTT: "0xae21A2015b0909d1009F30dd7A0b8aC653E81d9f",
};
// logo
export const logoList: stringKey = {
  FIBO: fibo,
  AWW: aww,
  NEST: nest,
  ADF: adf,
  VTT: vtt
}
export const price = {
  FIBO:1.7,
  AWW:80
}