import { useCallback, useEffect, useState } from "react"
import newContracts from "./useNewContract";
import { formatUnits } from "@/utils";

const usePoolAmount = (id: number) => {
    // poolAmount 代表池子总质押金额，used 代表是否使用过
    const [data, steDate] = useState<{ poolAmount: number | null, usedAmount: boolean }>({
        poolAmount: null,
        usedAmount: true
    })
    const setUsedAmount = () => {
        steDate({ ...data, usedAmount: true })
    }
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取指定池的信息的方法
    const getPoolAmount = useCallback(async () => {
        try {
            // 我希望id是number 和 有pool的时候使用
            if (Pool && typeof id === 'number') {
                const res = await Pool.poolAmount(id)
                steDate({ ...data, poolAmount: formatUnits(res, 18), usedAmount: false })
            }
        } catch (e) {
            steDate({ ...data, usedAmount: false })
            console.log('usePoolAmount', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool, id])
    // 监听getPoolInfo，因为useCallback的特性
    useEffect(() => {
        data.usedAmount && getPoolAmount()
    }, [getPoolAmount, data])
    return { ...data, setUsedAmount }
}

export default usePoolAmount