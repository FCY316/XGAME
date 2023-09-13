import { useCallback, useEffect, useState } from 'react'
import newContracts from './useNewContract';
import CounterContainer from "./useConnectedWallet";
import { formatUnits } from '@/utils';

//获取指定池，指定用户已提取奖励
const useUserReward = (id: number) => {
    // userReward 代表池子的信息，used 代表是否使用过
    const [data, steDate] = useState<{ userReward: number | null, usedPoolReward: boolean }>({
        userReward: null,
        usedPoolReward: true
    })
    const setUsedPoolReward = () => {
        steDate({ ...data, usedPoolReward: true })

    }
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取用户地址
    const { address } = CounterContainer.useContainer();
    // 获取指定池的信息的方法
    const getUserReward = useCallback(async () => {
        try {
            // 我希望id是number 和 有pool的时候使用
            if (Pool && typeof id === 'number') {
                const res = await Pool.userReward(id, address)
                steDate({ ...data, userReward: formatUnits(res), usedPoolReward: false })
            }
        } catch (e) {
            steDate({ ...data, usedPoolReward: false })
            console.log('usePoolInfo', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool, id])
    // 监听getPoolInfo，因为useCallback的特性
    useEffect(() => {
        data.usedPoolReward && getUserReward()
    }, [getUserReward, data])
    return { ...data, setUsedPoolReward }
}

export default useUserReward