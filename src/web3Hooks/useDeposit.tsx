import { useState } from "react";
import useListenerTransfer from "./useListenerTransfer";
import newContracts from "./useNewContract";
import { parseUnits } from "@/utils";

const useDeposit = (api: any, id: number, amount: number) => {
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取监听事件成功的方法
    const listenerTransferF = useListenerTransfer()
    const [depositLod, setLoading] = useState(false)
    const deposit = async () => {
        setLoading(true)
        try {
            if (Pool && amount) {
                const { hash } = await Pool.deposit(id, 0, parseUnits(amount));
                const relset = await listenerTransferF(hash)
                if (relset) {
                    api['success']({
                        message: '质押成功',
                        duration: 3,
                        description:
                            '点击去区块浏览器查看',
                        onClick: () => {
                            window.open(`https://scan.fibochain.org/tx/${hash}`)
                        },
                    });
                } else {
                    api['error']({
                        message: '质押失败',
                        duration: 3,
                        description:
                            '点击去区块浏览器查看',
                        onClick: () => {
                            window.open(`https://scan.fibochain.org/tx/${hash}`)
                        },
                    });
                }
            }
        } catch (e) {
            console.log('useDeposit', e);
        }
        setLoading(false)
    }
    return { deposit, depositLod }
}

export default useDeposit