import { useCallback, useEffect, useState } from "react"
import newContracts from "./useNewContract";
import CounterContainer from './useConnectedWallet'
const useUserActivationPool = (id: number) => {
    // limit 代表授权额度，used 代表是否使用过
    const [data, steDate] = useState<{ isPledge: boolean | null, usedIsPledge: boolean }>({
        isPledge: null,
        usedIsPledge: true
    })
    // 更新函数
    const setUsedIsPledge = () => {
        steDate({
            ...data, usedIsPledge: true
        })
    }
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取用户地址
    const { address } = CounterContainer.useContainer();
    // 方法
    const userActivationPool = useCallback(async () => {
        try {
            if (Pool) {
                const res = await Pool.userActivationPool(address, id)
                steDate({ ...data, isPledge: res, usedIsPledge: false })
            }
        } catch (e) {
            steDate({ ...data, usedIsPledge: false })
            console.log('useUserActivationPool', e);

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool, address, id])
    useEffect(() => {
        data.usedIsPledge && userActivationPool()
    }, [data, userActivationPool])
    return { ...data, setUsedIsPledge }
}

export default useUserActivationPool