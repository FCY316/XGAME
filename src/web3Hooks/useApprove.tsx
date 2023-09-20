import newContracts from "./useNewContract";
import { MaxUint256 } from "@/utils";
import contract from "@/abi";
import useListenerTransfer from "./useListenerTransfer";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useApprove = (api: any) => {
    // 翻译
    const { t } = useTranslation()
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
                        message: t('webhooks.authorizationSucceeds'),
                        duration: 3,
                        description:
                            t('webhooks.clickToGoToBlockbrowserToView'),
                        onClick: () => {
                            window.open(`https://scan.fibochain.org/tx/${hash}`)
                        },
                    });
                } else {
                    api['error']({
                        message: t('webhooks.authorizationFailed'),
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
            console.log('useApprove', e);

        }
        setLoading(false)
    }
    return { approve, approveLod }
}

export default useApprove