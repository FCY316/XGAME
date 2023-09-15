import { useCallback, useEffect, useState } from "react"
import newContracts from "./useNewContract"
import CounterContainer from "./useConnectedWallet";

// 获取指定池，指定用户的 历史账单
const useGetUserHistoryBill = (id: number) => {
    // limit 代表授权额度，used 代表是否使用过
    const [data, steDate] = useState<{ history: any[], usedHistoryt: boolean }>({
        history: [],
        usedHistoryt: true
    })
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取用户地址
    const { address } = CounterContainer.useContainer();
    // 调用方法
    const setUsedHistoryt = () => {
        steDate({ ...data, usedHistoryt: true })
    }
    // 查询历史订单的方法
    const getHistory = useCallback(async () => {
        try {
            if (Pool) {
                const list: any[] = []
                for (let index = 0; index < id; index++) {
                    const res = await Pool.userInfo(index, address, 0)
                    if (Number(res.lockStartTime)) {
                        list.push(res)
                        steDate({ ...data, history: list, usedHistoryt: false })
                    }
                    if (list.length === 0 && id - 1 === index) {
                        steDate({ ...data, usedHistoryt: false })
                    }
                }
            }
        } catch (e) {
            steDate({ ...data, usedHistoryt: false })
            console.log('useGetUserHistoryBill', e);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool, id])
    useEffect(() => {
        data.usedHistoryt && getHistory()
    }, [data, getHistory])
    return { ...data, setUsedHistoryt }
}

export default useGetUserHistoryBill