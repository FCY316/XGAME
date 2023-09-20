import './index.scss'
import close3 from '@/image/close3.png'
import jt from '@/image/jt.png'
import { Button, Modal, Popover, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { formatNumber, formatTimeToStr, formatTimeToStr2, formatUnits } from '@/utils'
import usePoolInfo from '@/web3Hooks/usePoolInfo'
import useWithdraw from '@/web3Hooks/useWithdraw'
import usePending from '@/web3Hooks/usePending'
import useGetblock from '@/web3Hooks/useGetblock'
import { logoList } from '@/abi/tokenAddress'
import { useTranslation } from 'react-i18next'

const Bill = (props: { type: number, item: any, api: any, setUsedHistoryt: Function }) => {
    const { item, api, setUsedHistoryt, type } = props
    // 翻译
    const { t } = useTranslation()
    // 0 提取 1提取 赎回 2赎回
    const [state, setState] = useState(0)
    // 获取池子的信息
    const { poolInfo } = usePoolInfo(Number(item.pid))
    // 获取当前块高
    const { block, setusedBlock } = useGetblock()
    // 对poolInfo,里面是一些需要的可以转换的进行转换
    const setPoolInfo = useCallback(() => {
        if (poolInfo) {
            // 获取质押的币的名称
            const name = poolInfo.name.split(" => ");
            // 算出还有多少天
            let timeQuantum = formatUnits(poolInfo.totalBlock, 0) * 3.78
            timeQuantum = Math.ceil(timeQuantum / 60 / 60 / 24)
            // 算出离当前区块有多少豪秒
            const blockTime = (formatUnits(poolInfo.startBlock, 0) + formatUnits(poolInfo.totalBlock, 0) - (block || 0)) * 3.78 * 1000
            return { timeQuantum, name, blockTime }
        }
    }, [block, poolInfo])

    // 获取可以提取的收益
    const { pending,
        usedPending,
        setUsedPending
    } = usePending(Number(item.pid), Number(item.bid))
    // 赎回或者提取收益
    const { withdraw, withdrawLod } = useWithdraw(api, item.pid, item.bid)
    // 详情是否展开
    const [show, setShow] = useState(false)
    // 赎回的控制参数
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 打开赎回弹窗
    const showModal = () => {
        setIsModalOpen(true);
    };
    // 关闭赎回弹窗
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // 提取的控制参数
    const [isModalOpenT, setIsModalOpenT] = useState(false);
    // 打开提取弹窗
    const showModalT = () => {
        setIsModalOpenT(true);
    };
    // 关闭提取弹窗
    const handleCancelT = () => {
        setIsModalOpenT(false);
    };
    // 提取收益 or 赎回
    const extracting = async (num: number) => {
        await withdraw(num)
        allFun()
    }
    const allFun = () => {
        setUsedPending()
        setUsedHistoryt()
        setusedBlock()
    }
    // 判断事件按钮算提，提取 赎回，还是已赎回
    const setdasd = useCallback(() => {
        if (poolInfo && block) {
            const lockEndTime = poolInfo.startBlock + poolInfo.totalBlock
            if (block < lockEndTime) {
                setState(0)
            } else if (block > lockEndTime && formatUnits(item.amount) > 0) {
                setState(1)
            } else {
                setState(2)
            }
        }
    }, [block, item.amount, poolInfo])
    // 选择展示的账单
    const getShow = () => {
        if (type === 0) return true
        else if (type === 1 && state !== 2) return true
        else if (type === 2 && state === 2) return true
        else return false
    }
    useEffect(() => {
        setdasd()
    }, [setdasd])
    return (
        <>
            {(getShow()) &&
                <div className='bill'>
                    <div className='bill_id'>ID: {(Number(item.bid) + 1)}</div>
                    <div className='bill_top'>
                        <div className='bill_top_img'>
                            <img src={logoList[setPoolInfo()?.name[1] || 'Fibo']} alt="" />
                            <img src={logoList[setPoolInfo()?.name[0] || 'Fibo']} alt="" />
                        </div>
                        <div className='bill_top_text'>
                            <div>{t('country.earn')}{setPoolInfo()?.name[1]}</div>
                            <div>{t('country.pledge')}{setPoolInfo()?.name[0]}</div>
                        </div>
                    </div>
                    <div className='bill_context'>
                        <div className='bill_context_item'>
                            <div className='bill_context_item_left'>{t('country.billAmount')}</div>
                            <div className='bill_context_item_right'>
                                <Popover content={formatUnits(item.amount)}>
                                    {formatNumber(formatUnits(item.amount))}{setPoolInfo()?.name[0]}
                                </Popover>
                            </div>
                        </div>
                        <div className='bill_context_item'>
                            <div className='bill_context_item_left'>{t('country.lockupCycle')}</div>
                            <div className='bill_context_item_right'><span>{setPoolInfo()?.timeQuantum}{t('country.day')}</span></div>
                        </div>
                        <div className='bill_context_item'>
                            <div className='bill_context_item_left'>{t('country.billType')}</div>
                            <div className='bill_context_item_right'><span>{state <= 1 ? t('country.pledge') : t('country.redeem')}</span></div>
                        </div>
                        <div className='bill_context_item'>
                            <div className='bill_context_item_left'>{t('country.lockingTime')}</div>
                            <div className='bill_context_item_right'>
                                <div>{t('country.start')}：<span>{formatTimeToStr(formatUnits(item.lockStartTime, 0) * 1000, '.')}</span></div>
                                <div>{t('country.finish')}：<span>{formatTimeToStr2((formatUnits(item.lockStartTime, 0) * 1000 + (setPoolInfo()?.blockTime || 0)), '.')}</span></div>
                            </div>
                        </div>
                        {state === 0 && <Button onClick={showModalT} className='bill_context_btn1 btn' type="primary">{t('country.withdrawalIncome')} </Button>}
                        {state === 1 && <div className='bill_context_btn2'>
                            <Button onClick={showModal} className='bill_context_btn2_s' type="primary">{t('country.redeem')}</Button>
                            <Button onClick={showModalT} className='bill_context_btn2_t btn' type="primary">{t('country.withdrawalIncome')}</Button>
                        </div>}
                        {state === 2 && <div className='bill_context_btn3'>{t('country.redeemed')}</div>}
                        <div className='bill_context_block' onClick={() => {
                            window.open('https://scan.fibochain.org/blocks')
                        }} >{t('country.endBlockHeight')} ：{poolInfo && formatUnits(poolInfo.startBlock, 0) + formatUnits(poolInfo.totalBlock, 0)}</div>
                    </div>
                    <Modal open={isModalOpen} onOk={handleCancel}
                        onCancel={handleCancel}
                        footer={[]}
                        closeIcon={false}
                        modalRender={(modal) => {
                            return <div className="bill_Modal">{modal}</div>;
                        }}>
                        <div className='bill_Modal_title'>
                            {t('country.redeem')}
                        </div>
                        <img onClick={handleCancel} className='bill_Modal_close' src={close3} alt="" />
                        <p className='bill_Modal_text'>{t('country.confirmRedeem')}</p>
                        <div className='bill_Modal_btn'>
                            <Button loading={withdrawLod} onClick={() => { extracting(formatUnits(item.amount)) }} className='bill_Modal_btn_btn btn' type="primary">{t('country.redeem')}</Button>
                        </div>
                    </Modal>
                    <Modal open={isModalOpenT} onOk={handleCancelT}
                        onCancel={handleCancelT}
                        footer={[]}
                        closeIcon={false}
                        modalRender={(modal) => {
                            return <div className="bill_Modal">{modal}</div>;
                        }}>
                        <div className='bill_Modal_title'>
                            {t('country.withdrawalIncome')}
                        </div>
                        <img onClick={handleCancelT} className='bill_Modal_close' src={close3} alt="" />
                        <div className='bill_Modal_context'>
                            <div className='bill_Modal_context_item'>
                                <div className='bill_Modal_context_item_left'>{t('country.cumulativeEarnedIncome')}</div>
                                <div className='bill_Modal_context_item_right'>
                                    <Popover content={formatUnits(item.historyRewardValue)}>
                                        {formatNumber(formatUnits(item.historyRewardValue))}{setPoolInfo()?.name[1]}
                                    </Popover>
                                </div>
                            </div>
                            <div className='bill_Modal_context_item'>
                                <div className='bill_Modal_context_item_left'>{t('country.withdrawableIncome')}</div>
                                <div className='bill_Modal_context_item_right'>
                                    <Popover content={usedPending ? <Spin /> : (pending || 0)}>
                                        {usedPending ? <Spin /> : formatNumber(pending || 0)}{setPoolInfo()?.name[1]}
                                    </Popover>

                                </div>
                            </div>
                            <div className='bill_Modal_context_btn2'>
                                <Button onClick={() => { extracting(0) }} loading={withdrawLod} className='bill_Modal_context_btn2_btn btn' type="primary">{t('country.withdrawalIncome')}</Button>
                            </div>
                            <div className='bill_Modal_context_info'>
                                <div className="bill_Modal_context_info_unfold" onClick={() => { setShow(!show) }}>
                                    <span>{t('country.info')}</span>
                                    <img className={show ? 'img180' : ''} src={jt} alt="" />
                                </div>
                                <div className={show ? 'bill_Modal_context_info_text' : 'bill_Modal_context_info_text h0'}>
                                    <div>
                                        <div>{t('country.timeOfPledge')}</div>
                                        <div>{formatTimeToStr(formatUnits(item.lockStartTime, 0) * 1000, '.')}</div>
                                    </div>
                                    <div>
                                        <div>{t('country.lockupEndTime')}</div>
                                        <div>{formatTimeToStr2((formatUnits(item.lockStartTime, 0) * 1000 + (setPoolInfo()?.blockTime || 0)), '.')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            }
        </>
    )
}

export default Bill