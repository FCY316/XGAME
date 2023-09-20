import { useCallback, useEffect, useState } from "react";
import newContracts from "./useNewContract";
import CounterContainer from "./useConnectedWallet";
import contract from "@/abi";
import { formatUnits } from "@/utils";

// 获取授权额度
const useAuthorization = () => {
    // limit 代表授权额度，used 代表是否使用过
    const [data, steDate] = useState<{ limit: number | null, usedLimit: boolean }>({
        limit: null,
        usedLimit: true
    })
    // 调用方法
    const setUsedLimit = () => {
        steDate({ ...data, usedLimit: true })
    }
    // 拿到合约
    const { erc20 } = newContracts.useContainer();
    // 获取用户地址
    const { address } = CounterContainer.useContainer();
    // 获取授权额度的方法
    const getAuthorization = useCallback(async () => {
        try {
            // 我希望id是number 和 有pool的时候使用
            if (erc20) {
                const res = await erc20.allowance(address, contract['Pool'].address)
                steDate({ ...data, limit: formatUnits(res), usedLimit: false })
            }
        } catch (e) {
            steDate({ ...data, usedLimit: false })
            console.log('usePoolInfo', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [erc20, address])
    // 监听getPoolInfo，因为useCallback的特性
    useEffect(() => {
        data.usedLimit && getAuthorization()
    }, [getAuthorization, data])
    return { ...data, setUsedLimit }
}

export default useAuthorization