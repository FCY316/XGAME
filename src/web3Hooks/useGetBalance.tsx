import newContracts from "./useNewContract";
import CounterContainer from "./useConnectedWallet";
import { useCallback, useEffect, useState } from "react";
import { formatUnits } from "@/utils";

// 查询余额
const useGetBalance = () => {
    // limit 代表授权额度，used 代表是否使用过
    const [data, steDate] = useState<{ balance: number | null, usedBalance: boolean }>({
        balance: null,
        usedBalance: true
    })
    const setUsedBalance = () => {
        steDate({ ...data, usedBalance: true })
    }
    // 拿到合约
    const { erc20 } = newContracts.useContainer();
    // 获取用户地址
    const { address } = CounterContainer.useContainer();
    // 拿到余额的方法
    const getBalance = useCallback(async () => {
        try {
            if (erc20) {
                const balance = await erc20.balanceOf(address)
                steDate({ ...data, balance: formatUnits(balance), usedBalance: false })
            }
        } catch (e) {
            steDate({ ...data, usedBalance: false })
            return { e, state: false };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, erc20])
    useEffect(() => {
        data.usedBalance && getBalance()
    }, [getBalance, data])
    return { ...data, setUsedBalance }
}

export default useGetBalance