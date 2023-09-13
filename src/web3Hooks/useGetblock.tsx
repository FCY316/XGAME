import { useCallback, useEffect, useState } from "react";
import CounterContainer from "./useConnectedWallet";
// 获取当前区块高度
const useGetblock = () => {
    // limit 代表授权额度，used 代表是否使用过
    const [data, steDate] = useState<{ block: number | null, usedBlock: boolean }>({
        block: null,
        usedBlock: true
    })
    const setusedBlock = () => {
        steDate({ ...data, usedBlock: true })

    }
    const { provider } = CounterContainer.useContainer();
    const getBlock = useCallback(async () => {
        try {
            if (provider) {
                const blockNumber = await provider.getBlockNumber();
                steDate({ ...data, block: blockNumber, usedBlock: false })
            }
        } catch (e) {
            steDate({ ...data, usedBlock: false })
            console.log('useGetblock', e);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider])
    useEffect(() => {
        data.usedBlock && getBlock()
    }, [data, getBlock])
    return { ...data, setusedBlock }
}

export default useGetblock