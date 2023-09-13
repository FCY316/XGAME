import { useCallback, useEffect, useState } from "react";
import newContracts from "./useNewContract";
import { poolInfoType } from "@/interface";
// 获取指定池的信息
const usePoolInfo = (id: number) => {
    // poolInfo 代表池子的信息，used 代表是否使用过
    const [data, steDate] = useState<{ poolInfo: poolInfoType | null, usedPoolInfo: boolean }>({
        poolInfo: null,
        usedPoolInfo: true
    })
    const setUsedPoolInfo = () => {
        steDate({ ...data, usedPoolInfo: true })
    }
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取指定池的信息的方法
    const getPoolInfo = useCallback(async () => {
        try {
            // 我希望id是number 和 有pool的时候使用
            if (Pool && typeof id === 'number') {
                const res = await Pool.poolInfo(id)
                steDate({ ...data, poolInfo: res, usedPoolInfo: false })
            }
        } catch (e) {
            steDate({ ...data, usedPoolInfo: false })
            console.log('usePoolInfo', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool, id])
    // 监听getPoolInfo，因为useCallback的特性
    useEffect(() => {
        data.usedPoolInfo && getPoolInfo()
    }, [getPoolInfo, data])
    return {...data,setUsedPoolInfo}
}

export default usePoolInfo