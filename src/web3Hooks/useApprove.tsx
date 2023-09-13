import newContracts from "./useNewContract";
import { MaxUint256 } from "@/utils";
import contract from "@/abi";
import useListenerTransfer from "./useListenerTransfer";
import { useState } from "react";

const useApprove = (api: any) => {
    // 拿到合约
    const { erc20 } = newContracts.useContainer();
    // 获取监听事件成功的方法
    const listenerTransferF = useListenerTransfer()
    const [approveLod, setLoading] = useState(false)
    const approve = async () => {
        setLoading(true)
        try {
            if (erc20) {
                const { hash } = await erc20.approve(contract['Pool'].address, MaxUint256);
                const relset = await listenerTransferF(hash)
                if (relset) {
                    api['success']({
                        message: '授权成功',
                        duration: 3,
                        description:
                            '点击去区块浏览器查看',
                        onClick: () => {
                            window.open(`https://scan.fibochain.org/tx/${hash}`)
                        },
                    });
                } else {
                    api['error']({
                        message: '授权失败',
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
            console.log('useApprove', e);

        }
        setLoading(false)
    }
    return { approve, approveLod }
}

export default useApprove