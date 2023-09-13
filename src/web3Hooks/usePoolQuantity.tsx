import { useCallback, useEffect, useState } from 'react'
import newContracts from './useNewContract';
// 工厂内拥有的池子数量
const usePoolQuantity = () => {
    // poolQuantity 代表池子的数量，used 代表是否使用过
    const [data, steDate] = useState({
        poolQuantity: 0,
        usedQuantity: false
    })
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 方法函数
    const getDate = useCallback(async () => {
        // 有pool的时候使用
        try {
            if (Pool) {
                const res = await Pool.poolQuantity()
                // 转化为numbe存入data
                steDate({ ...data, poolQuantity: Number(res), usedQuantity: true })
            }
        } catch (e) {
            steDate({ ...data, usedQuantity: true })
            console.log('usePoolQuantity', e);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pool])
    // 在合约存在的时候进行调用
    useEffect(() => {
        getDate()
    }, [getDate])
    return data
}

export default usePoolQuantity