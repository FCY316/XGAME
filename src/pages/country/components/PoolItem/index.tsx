import './index.scss'
import nest from '@/image/nest.png'
import fibo from '@/image/fibo.png'
import aww from '@/image/aww.png'
import vtt from '@/image/vtt.png'
import adf from '@/image/adf.png'
import downarrow from '@/image/downarrow.png'
import href2 from '@/image/href2.png'
import scan from '@/image/scan.png'
import closeIcon from '@/image/closeIcon.png'
import { Button, ConfigProvider, Drawer, Input, Popover, Slider, Spin } from 'antd'
import { formatNumber, formatUnits } from '@/utils'
import { ChangeEvent, useCallback, useState } from 'react'
import { SliderMarks } from 'antd/es/slider'
import usePoolInfo from '@/web3Hooks/usePoolInfo'
import usePoolAmount from '@/web3Hooks/usePoolAmount'
import useUserReward from '@/web3Hooks/useUserReward'
import { stringKey } from '@/interface'
import { tokenAddress } from '@/abi/tokenAddress'
import useGetblock from '@/web3Hooks/useGetblock'
import useUserActivationPool from '@/web3Hooks/useUserActivationPool'
import useDeposit from '@/web3Hooks/useDeposit'
const marks: SliderMarks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
};

// logo
const logoList: stringKey = {
    WFIBO: fibo,
    MMT: aww,
    NEST: nest,
    ADF: adf,
    VTT: vtt
}
/*
 showTime 用户是否选择了仅显示我质押的 true选择了
 timeState 用户选择的进行中还是已经结束的 0 进行中
 id 池子的id
 approve 授权方法
 approveLod 授权loading
 limit 授权额度
 usedLimit 查询授权额度loading
 setUsedLimit 调用查询授权额度
 balance 余额
 usedBalance 获取余额的loading
 setUsedBalance 刷新余额的方法
 api 是用户提示api
*/
const PoolItem = (props: { api: any, balance: number, usedBalance: boolean, setUsedBalance: Function, showTime: boolean, timeState: number, id: number, approve: Function, approveLod: boolean, limit: number, usedLimit: boolean, setUsedLimit: Function }) => {
    const { api, showTime, id, approve, approveLod, limit, usedLimit, setUsedLimit, timeState, balance, usedBalance, setUsedBalance } = props

    // 控制侧边栏的参数
    const [open, setOpen] = useState(false);
    // 详情是否展开
    const [show, setShow] = useState(false)
    // 用户输入的质押的数量参数
    const [num, setNum] = useState(0)
    // 去连接
    const go = (url: string) => {
        return () => {
            window.location.href = url
        }
    }
    // 打开侧边栏
    const showDrawer = () => {
        setOpen(true);
    };
    // 关闭侧边栏
    const onClose = () => {
        setOpen(false);
    };
    // 获取输入的数量质押
    const getNum = (e: ChangeEvent<HTMLInputElement>) => {
        // 小于0的不处理
        if (Number(e.target.value) < 0) return
        setNum(Number(e.target.value))
    }
    // 获取滑动的参数
    const getSlider = (e: number) => {
        // 使用余额乘以e /100
        const data = balance * (e / 100)
        setNum(data)
    }
    // 获取池子的信息
    const { poolInfo, usedPoolInfo, setUsedPoolInfo } = usePoolInfo(id)
    // console.log('poolInfo', poolInfo);
    // 获取池子的总质押量
    const { poolAmount, usedAmount, setUsedAmount } = usePoolAmount(id)
    // 获取用户已经提取的收益
    const { userReward, usedPoolReward, setUsedPoolReward } = useUserReward(id)
    // 获取当前块高
    const { block, usedBlock, setusedBlock } = useGetblock()
    // 获取是否对池中参与质押
    const { isPledge, setUsedIsPledge } = useUserActivationPool(id)
    // 质押的方法
    const { deposit, depositLod } = useDeposit(api, id, num)
    // 对poolInfo,poolAmount里面是一些需要的可以转换的进行转换
    const setPoolInfo = useCallback(() => {
        if (poolInfo) {
            // 获取质押的币的名称
            const name = poolInfo.name.split(" => ");
            // 算出还有多少天
            const blocks = formatUnits(poolInfo.startBlock, 0) + formatUnits(poolInfo.totalBlock, 0) - (block || 0)
            const blockTime = Math.ceil((blocks * 3.7) / 60 / 60 / 24)
            // 算出池子的锁定时长
            let timeQuantum = formatUnits(poolInfo.totalBlock, 0) + formatUnits(poolInfo.startBlock, 0)
            timeQuantum = Math.ceil(timeQuantum / 60 / 60 / 24)
            // 获取ARB
            let arb = 0
            // poolAmount必须是数字，且不等于0 ，等于0算出的结果是无穷大
            if (typeof poolAmount === 'number' && poolAmount) {
                const amort = formatUnits(poolInfo.totalRewards) / blockTime
                arb = amort / poolAmount
                arb = (arb / 100)
            }
            return { name, arb, blockTime, timeQuantum }
        }
    }, [poolInfo, block, poolAmount])
    // 刷新数据的方法
    const update = () => {
        setUsedPoolInfo()
        setUsedAmount()
        setUsedPoolReward()
        setUsedLimit()
        setusedBlock()
        setUsedIsPledge()
        setUsedBalance()
    }
    // 授权的方法和打开质押弹窗的方法
    const approveF = async () => {
        // limit 不是0，授权 否则是打开弹窗
        if (limit) {
            showDrawer()
        } else {
            await approve()
            update()

        }
    }
    // 质押
    const depositF = async () => {
        // 判断用户额度是否大于质押的参数 是的话授权，不是的话质押
        if (num > limit) {
            await approve()
            update()
        } else {
            await deposit()
            update()
            setNum(0)
        }
    }
    // 判断块高是否到达 blockis是false达到了
    const overBlock = useCallback(() => {
        if (poolInfo && block) {
            return formatUnits(poolInfo.startBlock, 0) + formatUnits(poolInfo.totalBlock, 0) > (block)
        }
    }, [block, poolInfo])
    // 判断组件是否显示
    const showComponents = () => {
        // blockis true 是没有到达 timeState是0代表进行中 showTime为false代表显示全部池子
        // isPledge true 我在当前池子有质押
        // 看块高是不是到了
        const blockis = overBlock()
        // 用户选择的是0  isPledge showTime
        if (!timeState) {
            // 判断块高有没有达到,没有达到话进行
            if (blockis) {
                // 判断用户选择的是我质押的
                if (showTime) {
                    // 判断有没有对池子进行质押
                    if (isPledge) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
        } else {
            // 判断用户的区块
            if (!blockis) {
                // 判断用户选择的是我质押的
                if (showTime) {
                    if (isPledge) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
        }
    }
    return (
        <>
            {
                showComponents() && <div className='poolItem'>
                    <div className='poolItem_tokenInfo'>
                        <div className='poolItem_tokenInfo_left'>
                            <div className='poolItem_tokenInfo_left_img'>
                                <img onClick={update} src={logoList[setPoolInfo()?.name[0] || 'Fibo']} alt="" />
                                <img src={logoList[setPoolInfo()?.name[1] || 'Fibo']} alt="" />
                            </div>
                            <div className='poolItem_tokenInfo_left_text'>
                                <div>赚取{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[0]}</div>
                                <div>质押{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[1]}</div>
                            </div>
                        </div>
                        <div className='poolItem_tokenInfo_right'>
                            APR：
                            <Popover content={setPoolInfo()?.arb}>
                                <span> {(usedPoolInfo && usedAmount) ? <Spin /> : formatNumber(setPoolInfo()?.arb || 0)}%</span>
                            </Popover>
                        </div>
                    </div>
                    <div className='poolItem_earnings'>
                        <div>
                            <div>已赚取{setPoolInfo()?.name[1]}</div>
                            <div>
                                <Popover content={userReward}>
                                    {usedPoolReward ? <Spin /> : formatNumber(userReward || 0)}
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <div>TVL</div>
                            <div>
                                <Popover content={`$${123.235141478451458}`}>
                                    ${formatNumber(1.235141478451458)}
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <div>结束倒计时</div>
                            <div>
                                {overBlock() ? <Popover content={`${setPoolInfo()?.blockTime}天`}>
                                    {(usedBlock || usedPoolInfo || usedAmount) ? <Spin /> : setPoolInfo()?.blockTime}天
                                </Popover> : '已经结束'}
                            </div>
                        </div>
                    </div>
                    <div className={show ? 'poolItem_unfold bg' : 'poolItem_unfold'} onClick={() => { setShow(!show) }}>
                        <span>详情</span>
                        <img className={show ? 'img180' : ''} src={downarrow} alt="" />
                    </div>
                    <div className={show ? 'poolItem_info hauto' : 'poolItem_info'}>
                        <div className='poolItem_info_start'>
                            <p>开始挖矿</p>
                            <Button disabled={!overBlock()} loading={usedLimit || approveLod} onClick={approveF} className='poolItem_info_start_btn' type="primary">{limit ? '质押' : '启用'}</Button>
                        </div>
                        <div className='poolItem_info_token'>
                            <p><span onClick={go(`https://scan.fibochain.org/address/${tokenAddress[setPoolInfo()?.name[1] || 'WFIBO']}`)}>查看代币信息</span> <img src={href2} alt="" /></p>
                            <p><span onClick={go(`https://scan.fibochain.org/address/${poolInfo?.rewardToken}`)}>查看合约</span> <img src={scan} alt="" /></p>
                        </div>
                    </div>
                    <ConfigProvider
                        theme={{
                            components: {
                                Drawer: {
                                    colorBgElevated: '#344081',
                                    colorSplit: 'transparent'
                                },
                                Slider: {
                                    railSize: 11,
                                    controlSize: 11,
                                    trackBg: "#EFF2FF",
                                    borderRadiusXS: 10,
                                    dotSize: 0,
                                    colorText: '#ffffff',
                                    colorTextDescription: "#A4B0EA"
                                }
                            },
                        }}>
                        <Drawer
                            className='poolItem_drawer'
                            placement={'bottom'}
                            height={'80%'}
                            onClose={onClose}
                            closeIcon={null}
                            open={open}
                            title={
                                <div className='poolItem_drawer_title'>
                                    质押{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[1]}赚取{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[0]}
                                    <img
                                        onClick={onClose}
                                        src={closeIcon}
                                        alt=""
                                    />
                                </div>
                            }
                        >
                            <div className='poolItem_drawer_token'>
                                <div className='poolItem_drawer_token_left'>
                                    <span>质押:</span>
                                    <img src={logoList[setPoolInfo()?.name[0] || 'Fibo']} alt="" />
                                    <span>{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[0]}</span>
                                </div>
                                <div className='poolItem_drawer_token_right'>
                                    <span>余额：</span>
                                    <span> <Popover placement="left" content={`$${balance}`}>
                                        {usedBalance ? <Spin /> : formatNumber(balance)}
                                    </Popover></span>
                                </div>
                            </div>
                            <div className='poolItem_drawer_input'>
                                <Input value={num || ''} onChange={getNum} type='number' className='poolItem_drawer_input_input' placeholder="0.00" />
                                <div onClick={() => { setNum(balance) }} className='poolItem_drawer_input_max'>MAX</div>
                            </div>
                            <Slider
                                value={(num / balance) * 100}
                                onChange={getSlider}
                                railStyle={{ background: '#5A6CC4' }}
                                trackStyle={{ background: "#EFF2FF" }}
                                className='poolItem_drawer_slider' marks={marks} defaultValue={0} />
                            <div className='poolItem_drawer_period'>
                                <div>锁仓周期：</div>
                                <div><span>{usedPoolInfo ? <Spin /> : setPoolInfo()?.timeQuantum}</span>天</div>
                            </div>
                            <div className='poolItem_drawer_info'>
                                <p className='poolItem_drawer_info_title'>
                                    锁仓概览
                                </p>
                                <div className='poolItem_drawer_info_context'>
                                    <div>
                                        <div>APR</div>
                                        <div>{(usedPoolInfo && usedAmount) ? <Spin /> : formatNumber(setPoolInfo()?.arb || 0)}%</div>
                                    </div>
                                    <div>
                                        <div>锁定时长</div>
                                        <div>{usedPoolInfo ? <Spin /> : setPoolInfo()?.timeQuantum} 天</div>
                                    </div>
                                    <div>
                                        <div>解锁日期</div>
                                        <div>--</div>
                                    </div>
                                </div>
                            </div>
                            <Button  loading={depositLod} onClick={depositF} className='poolItem_drawer_btn' type="primary">质押</Button>

                        </Drawer>
                    </ConfigProvider>
                </div>
            }
        </>

    )
}

export default PoolItem