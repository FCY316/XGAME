import { useState } from "react";
import useListenerTransfer from "./useListenerTransfer";
import newContracts from "./useNewContract";
import { parseUnits } from "@/utils";
import { useTranslation } from "react-i18next";

const useWithdraw = (api: any, pid: number, bid: number) => {
    // 翻译
    const { t } = useTranslation()
    // 拿到合约
    const { Pool } = newContracts.useContainer();
    // 获取监听事件成功的方法
    const listenerTransferF = useListenerTransfer()
    const [withdrawLod, setLoading] = useState(false)
    const withdraw = async (amount: number) => {
        setLoading(true)
        try {
            if (Pool) {
                console.log(amount);
                const { hash } = await Pool.withdraw(pid, bid, parseUnits(amount));
                const relset = await listenerTransferF(hash)
                if (relset) {
                    api['success']({
                        message: t('webhooks.successfulWithdrawalOfIncome'),
                        duration: 3,
                        description:
                            t('webhooks.clickToGoToBlockbrowserToView'),
                        onClick: () => {
                            window.open(`https://scan.fibochain.org/tx/${hash}`)
                        },
                    });
                } else {
                    api['error']({
                        message: t('webhooks.yieldFailure'),
                        duration: 3,
                        description:
                            t('webhooks.clickToGoToBlockbrowserToView'),
                        onClick: () => {
                            window.open(`https://scan.fibochain.org/tx/${hash}`)
                        },
                    });
                }
            }
        } catch (e) {
            console.log('useWithdraw', e);

        }
        setLoading(false)
    }
    return { withdraw, withdrawLod }

}

export default useWithdraw