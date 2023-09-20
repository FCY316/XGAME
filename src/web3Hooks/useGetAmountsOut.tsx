import { useCallback, useEffect, useState } from 'react'
import newContracts from './useNewContract';
import { getPriceAddress } from '@/abi/tokenAddress'
import { formatUnits, parseUnits } from '@/utils';
// 获取项目的主币价
const useGetAmountsOut = () => {
    const { tokenInAddressAWW, tokenOutAddressUSDT, tokenInAddressWFIBO } = getPriceAddress
    // UniswapV2Pair v2 合约 
    const { UniswapV2Pair } = newContracts.useContainer();
    // price 代表价格，usedPrice 代表是否使用过
    const [data, steDate] = useState<{ price: { FIBO: number, AWW: number }, usedPrice: boolean }>({
        price: {
            FIBO: 0,
            AWW: 0
        },
        usedPrice: true
    })
    // 调用方法
    const setUsedLimit = () => {
        steDate({ ...data, usedPrice: true })
    }
    const inputAmount = parseUnits('1'); // 示例：1 ETH
    // 获取项目的主币价的方法
    const getAmountsOut = useCallback(async () => {
        try {
            // 我希望id是number 和 有pool的时候使用
            if (UniswapV2Pair) {
                // amounts[0] 是usdt的价格
                // 输出金额是 amounts[1]，以 wei 为单位，需要转换为以太
                const amountsAWW = await UniswapV2Pair.getAmountsOut(inputAmount, [tokenInAddressAWW, tokenOutAddressUSDT])
                const amountsFIBO = await UniswapV2Pair.getAmountsOut(inputAmount, [tokenInAddressWFIBO, tokenOutAddressUSDT])

                const AWW = formatUnits(amountsAWW[1]);
                const FIBO = formatUnits(amountsFIBO[1]);
                console.log(AWW, FIBO);

                steDate({ ...data, price: { AWW, FIBO }, usedPrice: false })
            }
        } catch (e) {
            steDate({ ...data, usedPrice: false })
            console.log('useGetAmountsOut', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UniswapV2Pair])
    useEffect(() => {
        data.usedPrice && getAmountsOut()
    }, [getAmountsOut, data])
    return { ...data, setUsedLimit }
}

export default useGetAmountsOut