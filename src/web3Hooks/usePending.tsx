import { useCallback, useEffect, useState } from "react";
import newContracts from "./useNewContract";
import CounterContainer from './useConnectedWallet'
import { formatUnits } from "@/utils";
const usePending = (pid: number, bid: number) => {
    // pending 代表池子总质押金额，used 代表是否使用过
    const [data, steDate] = useState<{ pending: number | null, usedPending: boolean }>({
        pending: null,
        usedPending: true
    })
    const setUsedPending = () => {
        steDate({ ...data, usedPending: true })
    }
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取用户地址
    const { address } = CounterContainer.useContainer();
    // 获取指定池的信息的方法
    const getPending = useCallback(async () => {
        try {
            // 我希望id是number 和 有pool的时候使用
            if (Pool && typeof pid === 'number') {
                const res = await Pool.pending(pid, address, bid)
                steDate({ ...data, pending: formatUnits(res, 18), usedPending: false })
            }
        } catch (e) {
            steDate({ ...data, usedPending: false })
            console.log('usePending', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool, pid, bid])
    // 监听getPoolInfo，因为useCallback的特性
    useEffect(() => {
        data.usedPending && getPending()
    }, [getPending, data])
    return { ...data, setUsedPending }

}

export default usePending