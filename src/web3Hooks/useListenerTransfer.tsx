import CounterContainer from "./useConnectedWallet";

const useListenerTransfer = () => {
    const { provider } = CounterContainer.useContainer();
    const listenerTransferF = (transactionHash: any) => {
        return new Promise((reslove, reject) => {
            provider?.once(transactionHash, (receipt: any) => {
                if (receipt.status) {
                    reslove(true);
                }
                reslove(false);
            });
        });
    };
    return listenerTransferF
}

export default useListenerTransfer