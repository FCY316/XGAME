import './index.scss'
import nest from '@/image/nest.png'
import fibo from '@/image/fibo.png'
import aww from '@/image/aww.png'
import vtt from '@/image/vtt.png'
import adf from '@/image/adf.png'
import close3 from '@/image/close3.png'
import jt from '@/image/jt.png'
import { Button, Modal, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { formatNumber, formatTimeToStr, formatUnits } from '@/utils'
import usePoolInfo from '@/web3Hooks/usePoolInfo'
import { stringKey } from '@/interface'
import useWithdraw from '@/web3Hooks/useWithdraw'
import usePending from '@/web3Hooks/usePending'
// logo
const logoList: stringKey = {
    WFIBO: fibo,
    MMT: aww,
    NEST: nest,
    ADF: adf,
    VTT: vtt
}
const Bill = (props: { item: any, api: any, setUsedHistoryt: Function }) => {
    const { item, api, setUsedHistoryt } = props
    // 1 提取 2提取 赎回 3赎回
    const [state, setState] = useState(1)
    // 获取池子的信息
    const { poolInfo } = usePoolInfo(Number(item.pid))
    // 对poolInfo,里面是一些需要的可以转换的进行转换
    const setPoolInfo = useCallback(() => {
        if (poolInfo) {
            // 获取质押的币的名称
            const name = poolInfo.name.split(" => ");
            let timeQuantum = formatUnits(poolInfo.totalBlock, 0) + formatUnits(poolInfo.startBlock, 0)
            timeQuantum = Math.ceil(timeQuantum / 60 / 60 / 24)
            return { timeQuantum, name }
        }
    }, [poolInfo])

    // 获取可以提取的收益
    const { pending,
        usedPending,
        setUsedPending
    } = usePending(Number(item.pid), Number(item.bid))
    // 赎回或者提取收益
    const { withdraw, withdrawLod } = useWithdraw(api, item.bid, item.pid)
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
    }
    const setdasd = () => {
        const lockEndTime = formatUnits(item.lockEndTime, 0) * 1000
        const time = new Date().getTime()
        if (time < lockEndTime) {
            setState(1)
        } else if (time > lockEndTime && formatUnits(item.amount) > 0) {
            setState(2)
        } else {
            setState(3)
        }
    }
    useEffect(() => {
        setdasd()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item])
    return (
        <div className='bill'>
            <div className='bill_id'>ID:1</div>
            <div className='bill_top'>
                <div className='bill_top_img'>
                    <img src={logoList[setPoolInfo()?.name[0] || 'Fibo']} alt="" />
                    <img src={logoList[setPoolInfo()?.name[1] || 'Fibo']} alt="" />
                </div>
                <div className='bill_top_text'>
                    <div>赚取AWW</div>
                    <div>质押AWW</div>
                </div>
            </div>
            <div className='bill_context'>
                <div className='bill_context_item'>
                    <div className='bill_context_item_left'>账单金额</div>
                    <div className='bill_context_item_right'>{formatNumber(formatUnits(item.amount))}ABC</div>
                </div>
                <div className='bill_context_item'>
                    <div className='bill_context_item_left'>锁仓周期</div>
                    <div className='bill_context_item_right'>{setPoolInfo()?.timeQuantum}天</div>
                </div>
                <div className='bill_context_item'>
                    <div className='bill_context_item_left'>账单类型</div>
                    <div className='bill_context_item_right'>质押</div>
                </div>
                <div className='bill_context_item'>
                    <div className='bill_context_item_left'>锁定时间</div>
                    <div className='bill_context_item_right'>
                        <div><span>开始：</span>{formatTimeToStr(formatUnits(item.lockStartTime, 0) * 1000, '.')}</div>
                        <div><span>结束：</span>{formatTimeToStr(formatUnits(item.lockEndTime, 0) * 1000, '.')}</div>
                    </div>
                </div>
                {state === 1 && <Button onClick={showModalT} className='bill_context_btn1' type="primary">提取收益</Button>}
                {state === 2 && <div className='bill_context_btn2'>
                    <Button onClick={showModal} className='bill_context_btn2_s' type="primary">赎回</Button>
                    <Button onClick={showModalT} className='bill_context_btn2_t' type="primary">提取收益</Button>
                </div>}
                {state === 3 && <Button className='bill_context_btn3' type="primary">已赎回</Button>}
            </div>
            <Modal open={isModalOpen} onOk={handleCancel}
                onCancel={handleCancel}
                footer={[]}
                closeIcon={false}
                modalRender={(modal) => {
                    return <div className="bill_Modal">{modal}</div>;
                }}>
                <div className='bill_Modal_title'>
                    赎回
                </div>
                <img onClick={handleCancel} className='bill_Modal_close' src={close3} alt="" />
                <p className='bill_Modal_text'>确认赎回您的本金，一旦赎回将不再产生收益</p>
                <div className='bill_Modal_btn'>
                    <Button loading={withdrawLod} onClick={() => { extracting(formatUnits(item.amount)) }} className='bill_Modal_btn_btn' type="primary">赎回</Button>
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
                    提取收益
                </div>
                <img onClick={handleCancelT} className='bill_Modal_close' src={close3} alt="" />
                <div className='bill_Modal_context'>
                    <div className='bill_Modal_context_item'>
                        <div className='bill_Modal_context_item_left'>累计赚取收益</div>
                        <div className='bill_Modal_context_item_right'>{formatNumber(formatUnits(item.historyRewardValue))}{setPoolInfo()?.name[1]}</div>
                    </div>
                    <div className='bill_Modal_context_item'>
                        <div className='bill_Modal_context_item_left'>可提取收益</div>
                        <div className='bill_Modal_context_item_right'> {usedPending ? <Spin /> : formatNumber(pending || 0)}{setPoolInfo()?.name[1]}</div>
                    </div>
                    <div className='bill_Modal_context_btn2'>
                        <Button onClick={() => { extracting(0) }} loading={withdrawLod} className='bill_Modal_context_btn2_btn' type="primary">提取收益</Button>
                    </div>
                    <div className='bill_Modal_context_info'>
                        <div className="bill_Modal_context_info_unfold" onClick={() => { setShow(!show) }}>
                            <span>详情</span>
                            <img className={show ? 'img180' : ''} src={jt} alt="" />
                        </div>
                        <div className={show ? 'bill_Modal_context_info_text' : 'bill_Modal_context_info_text h0'}>
                            <div>
                                <div>质押时间</div>
                                <div>{formatTimeToStr(formatUnits(item.lockStartTime, 0) * 1000, '.')}</div>
                            </div>
                            <div>
                                <div>锁仓结束时间</div>
                                <div>{formatTimeToStr(formatUnits(item.lockEndTime, 0) * 1000, '.')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Bill