import './index.scss'
import downarrow from '@/image/downarrow.png'
import href2 from '@/image/href2.png'
import scan from '@/image/scan.png'
import closeIcon from '@/image/closeIcon.png'
import { Button, ConfigProvider, Drawer, DrawerProps, Input, Popover, Slider, Spin, message } from 'antd'
import { formatNumber, formatUnits } from '@/utils'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { SliderMarks } from 'antd/es/slider'
import usePoolInfo from '@/web3Hooks/usePoolInfo'
import usePoolAmount from '@/web3Hooks/usePoolAmount'
import useUserReward from '@/web3Hooks/useUserReward'
import { logoList, tokenAddress } from '@/abi/tokenAddress'
import useGetblock from '@/web3Hooks/useGetblock'
import useUserActivationPool from '@/web3Hooks/useUserActivationPool'
import useDeposit from '@/web3Hooks/useDeposit'
import { useTranslation } from 'react-i18next'
import useGetAmountsOut from '@/web3Hooks/useGetAmountsOut'
const marks: SliderMarks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
};
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
    // 翻译 
    const { t } = useTranslation()
    const [messageApi, contextHolder] = message.useMessage();
    // 控制侧边栏的参数
    const [open, setOpen] = useState(false);
    // 详情是否展开
    const [show, setShow] = useState(false)
    // 用户输入的质押的数量参数
    const [num, setNum] = useState('')
    // 去连接
    const go = (url: string) => {
        return () => {
            window.open(url)
        }
    }
    // 获取该项目的币价
    const {price,usedPrice} = useGetAmountsOut()
    // 页面的弹窗出现的位置
    const [placement, setPlacement] = useState<DrawerProps['placement']>('bottom')
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
        setNum((e.target.value))
    }
    // 获取滑动的参数
    const getSlider = (e: number) => {
        // 使用余额乘以e /100
        const data = balance * (e / 100)
        setNum(data + '')
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
    const { deposit, depositLod } = useDeposit(api, id, Number(num))
    // 对poolInfo,poolAmount里面是一些需要的可以转换的进行转换
    const setPoolInfo = useCallback(() => {
        if (poolInfo) {
            // 获取质押的币的名称
            const name = poolInfo.name.split(" => ");
            // 算出还有多少天
            const blocks = formatUnits(poolInfo.startBlock, 0) + formatUnits(poolInfo.totalBlock, 0) - (block || 0)
            const blockTime = Math.ceil((blocks * 3.78) / 60 / 60 / 24)
            // 算出池子的锁定时长
            let timeQuantum = formatUnits(poolInfo.totalBlock, 0) * 3.78
            timeQuantum = Math.ceil(timeQuantum / 60 / 60 / 24)
            // 获取ARB price
            let arb = 0
            // poolAmount必须是数字，且不等于0 ，等于0算出的结果是无穷大
            if (poolInfo && poolAmount && price) {
                arb = (formatUnits(poolInfo.totalRewards) * price.FIBO) / (timeQuantum * 360) / poolAmount * price.AWW
                arb = (arb / 100)
            }
            const tvl = poolAmount ? poolAmount * price.AWW : 0
            return { name, arb, blockTime, timeQuantum, tvl }
        }
    }, [poolInfo, block, poolAmount, price])
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
        setNum(Number(num) + '')
        if (Number(num) <= 0) return messageApi.warning(t('country.theAmountPledgedMustBeGreaterThan0'));
        else if (Number(num) > balance) return messageApi.warning(t('country.theAmountPledgedIsGreaterThanTheBalance'));
        // 判断用户额度是否大于质押的参数 是的话授权，不是的话质押
        if (Number(num) > limit) {
            await approve()
            update()
        } else {
            await deposit()
            update()
            setNum('')
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
    // 监听页面的宽度，用于热门DAO弹窗展示的位置
    useEffect(() => {
        window.innerWidth >= 780 ? setPlacement('right') : setPlacement('bottom')
        window.addEventListener('resize', () => {
            const pageWidth = window.innerWidth;
            // 当页面大于或等于780的时候，弹窗为right
            pageWidth >= 780 ? setPlacement('right') : setPlacement('bottom')
        });
    }, [])
    return (
        <>
            {
                showComponents() && <div className='poolItem'>
                    {contextHolder}
                    <div className='poolItem_tokenInfo'>
                        <div className='poolItem_tokenInfo_left'>
                            <div className='poolItem_tokenInfo_left_img'>
                                <img onClick={update} src={logoList[setPoolInfo()?.name[1] || 'Fibo']} alt="" />
                                <img src={logoList[setPoolInfo()?.name[0] || 'Fibo']} alt="" />
                            </div>
                            <div className='poolItem_tokenInfo_left_text'>
                                <div>{t('country.earn')}{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[1]}</div>
                                <div>{t('country.pledge')}{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[0]}</div>
                            </div>
                        </div>
                        <div className='poolItem_tokenInfo_right'>
                            APR：
                            <Popover content={setPoolInfo()?.arb}>
                                <span> {(usedPoolInfo && usedAmount && usedPrice) ? <Spin /> : formatNumber(setPoolInfo()?.arb || 0)}%</span>
                            </Popover>
                        </div>
                    </div>
                    <div className='poolItem_earnings'>
                        <div>
                            <div>{t('country.earned')}{setPoolInfo()?.name[1]}</div>
                            <div>
                                <Popover content={userReward}>
                                    {usedPoolReward ? <Spin /> : formatNumber(userReward || 0)}
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <div>TVL</div>
                            <div>
                                <Popover content={`$${setPoolInfo()?.tvl || 0}`}>
                                    ${formatNumber(setPoolInfo()?.tvl || 0)}
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <div>{t('country.endCountdown')}</div>
                            <div>
                                {overBlock() ? <Popover content={`${setPoolInfo()?.blockTime}天`}>
                                    {(usedBlock || usedPoolInfo || usedAmount) ? <Spin /> : setPoolInfo()?.blockTime}{t('country.day')}
                                </Popover> : t('country.alreadyOver')}
                            </div>
                        </div>
                    </div>
                    <div className={show ? 'poolItem_unfold bg' : 'poolItem_unfold'} onClick={() => { setShow(!show) }}>
                        <span>{t('country.info')}</span>
                        <img className={show ? 'img180' : ''} src={downarrow} alt="" />
                    </div>
                    <div className={show ? 'poolItem_info hauto' : 'poolItem_info'}>
                        <div className='poolItem_info_start'>
                            <p>{t('country.startMining')}</p>
                            <Button disabled={!overBlock()} loading={usedLimit || approveLod} onClick={approveF} className='poolItem_info_start_btn btn' type="primary">{limit ? t('country.pledge') : t('country.startUsing')}</Button>
                        </div>
                        <div className='poolItem_info_token'>
                            <p><span onClick={go(`https://scan.fibochain.org/address/${tokenAddress[setPoolInfo()?.name[1] || 'FIBO']}`)}>{t('country.viewTokenInformation')}</span> <img src={href2} alt="" /></p>
                            <p><span onClick={go(`https://scan.fibochain.org/address/${poolInfo?.rewardToken}`)}>{t('country.viewContract')}</span> <img src={scan} alt="" /></p>
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
                            placement={placement}
                            height={'80%'}
                            width={'500px'}
                            onClose={onClose}
                            closeIcon={null}
                            open={open}
                            title={
                                <div className='poolItem_drawer_title'>
                                    {t('country.pledge')}{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[0]}{t('country.earn')}{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[1]}
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
                                    <span>{t('country.pledge')}:</span>
                                    <img src={logoList[setPoolInfo()?.name[0] || 'Fibo']} alt="" />
                                    <span>{usedPoolInfo ? <Spin /> : setPoolInfo()?.name[0]}</span>
                                </div>
                                <div className='poolItem_drawer_token_right'>
                                    <span>{t('country.balance')}：</span>
                                    <span> <Popover placement="left" content={`$${balance}`}>
                                        {usedBalance ? <Spin /> : formatNumber(balance)}
                                    </Popover></span>
                                </div>
                            </div>
                            <div className='poolItem_drawer_input'>
                                <Input value={num} onChange={getNum} type='number' className='poolItem_drawer_input_input' placeholder="0.00" />
                                <div onClick={() => { setNum(balance + '') }} className='poolItem_drawer_input_max'>MAX</div>
                            </div>
                            <Slider
                                value={(Number(num) / balance) * 100}
                                onChange={getSlider}
                                railStyle={{ background: '#5A6CC4' }}
                                trackStyle={{ background: "#EFF2FF" }}
                                className='poolItem_drawer_slider' marks={marks} defaultValue={0} />
                            <div className='poolItem_drawer_period'>
                                <div>{t('country.lockupCycle')}：</div>
                                <div><span>{usedPoolInfo ? <Spin /> : setPoolInfo()?.timeQuantum}</span>天</div>
                            </div>
                            <div className='poolItem_drawer_info'>
                                <p className='poolItem_drawer_info_title'>
                                    {t('country.overviewOfLockers')}
                                </p>
                                <div className='poolItem_drawer_info_context'>
                                    <div>
                                        <div>APR</div>
                                        <div>{(usedPoolInfo && usedAmount && usedPrice) ? <Spin /> : formatNumber(setPoolInfo()?.arb || 0)}%</div>
                                    </div>
                                    <div>
                                        <div>{t('country.lockDuration')}                                    {t('country.overviewOfLockers')}
                                        </div>
                                        <div>{usedPoolInfo ? <Spin /> : setPoolInfo()?.timeQuantum} {t('country.day')}</div>
                                    </div>
                                </div>
                            </div>
                            <Button loading={depositLod} onClick={depositF} className='poolItem_drawer_btn btn' type="primary"> {t('country.pledge')}</Button>

                        </Drawer>
                    </ConfigProvider>
                </div>
            }
        </>

    )
}

export default PoolItem