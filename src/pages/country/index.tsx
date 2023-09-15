import { ConfigProvider, Segmented, Select, Switch, notification } from 'antd'
import './index.scss'
import { useCallback, useState } from 'react'
import PoolItem from './components/PoolItem'
import bluebottom from '@/image/bluebottom.png'
import Bill from './components/Bill'
import usePoolQuantity from '@/web3Hooks/usePoolQuantity'
import SpinC from '@/components/SpinC'
import useApprove from '@/web3Hooks/useApprove'
import useAuthorization from '@/web3Hooks/useAuthorization'
import useGetBalance from '@/web3Hooks/useGetBalance'
import useGetUserHistoryBill from '@/web3Hooks/useGetUserHistoryBill'
import { country } from '@/data'
import Sample from '@/components/Sample'
const tab = ['农场', '历史账单']
const boClass = ['country_tab_bo', 'country_tab_bo right']
// const cycleList = [
//   { value: 0, label: '全部' },
//   { value: 1, label: '500天线性释放' },
//   { value: 2, label: '300天线性释放' },
//   { value: 3, label: '300天' },
// ]
const typeList = [
  { value: 0, label: '全部' },
  { value: 1, label: '质押' },
  { value: 2, label: '赎回' },
]
const options = ['进行中', '已结束']
const Country = () => {
  // 提示
  const [api, contextHolder] = notification.useNotification();
  // tab选择选择的是农村还是历史账单
  const [tabIndex, setTabIndex] = useState(1)
  // 判断是不是只显示我质押的
  const [showTime, setShowTime] = useState(false)
  // 锁仓周期
  // const [cycle, setCycle] = useState(0)
  // 账单类型
  const [type, setType] = useState(0)
  // 获取锁仓周期的选择
  // const lockupCycle = (e: number) => {
  //   setCycle(Number(e))
  // }
  // 选择的的进行中还是结束
  const [timeState, setTimeState] = useState<number>(0)
  const timeover = (e: any) => {
    const index = options.indexOf(e)
    setTimeState(index)
  }
  // 获取账单类型
  const getType = (e: number) => {
    setType(Number(e))
  }
  // 获取余额
  const { balance, usedBalance, setUsedBalance } = useGetBalance()
  // 获取授权的方法
  const { approve, approveLod } = useApprove(api)
  // 获取池子的数量，通过池子的数量来遍历组件
  const { poolQuantity, usedQuantity, setUsedQuantity } = usePoolQuantity()
  // 获取用户的授权额度
  const { limit, usedLimit, setUsedLimit } = useAuthorization()
  // 获取所有的历史订单
  const { history, usedHistoryt, setUsedHistoryt } = useGetUserHistoryBill(poolQuantity)
  // 通过PoolItem来遍历组件
  const forPoolQuantity = useCallback(() => {
    const data = []
    for (let index = 0; index < poolQuantity; index++) {
      data.push(<div className='country_pledge_pool_item' key={index}>
        <PoolItem api={api} balance={balance || 0} usedBalance={usedBalance} setUsedBalance={setUsedBalance}
          showTime={showTime} timeState={timeState} limit={limit || 0} usedLimit={usedLimit} setUsedLimit={setUsedLimit} id={index} approve={approve} approveLod={approveLod} /></div>)
    }
    data.push(<div key={'ww'} className='country_pledge_pool_item' ><Sample logo1='VTT' logo2='AWW' /></div>)
    data.push(<div key={'cc'} className='country_pledge_pool_item' ><Sample logo1='ADF' logo2='AWW' /></div>)
    data.push(<div key={'dd'} className='country_pledge_pool_item' ><Sample logo1='NEST' logo2='AWW' /></div>)

    return data
  }, [api, approve, approveLod, balance, limit, poolQuantity, setUsedBalance, setUsedLimit, showTime, timeState, usedBalance, usedLimit])
  const setTab = (index: number) => {
    index ? setUsedHistoryt() : setUsedQuantity()
    setTabIndex(index)
  }
  return (
    <div className='country'>
      {contextHolder}
      <div className='country_tab'>
        {tab.map((item: string, index: number) => {
          return <div className={tabIndex === index ? 'fontColor' : ''} onClick={() => { setTab(index) }} key={item}>
            {item}
          </div>
        })}
        <div className={boClass[tabIndex]}></div>
      </div>
      {
        !!!tabIndex && <div className='country_pc'>
          <div className='country_pledge'>
            <div className='country_pledge_banner'>
              <img src={country.imgUrl} alt="" />
            </div>
            <div className='country_pledge_showTab'>
              <ConfigProvider
                theme={{
                  components: {
                    Segmented: {
                      itemColor: '#6165C2',
                      itemSelectedBg: '#4C65E7',
                      itemSelectedColor: '#fff',
                      itemHoverColor: '#fff',
                      colorBgLayout: '#D0D6F6',
                      borderRadius: 20
                    },
                  },
                }}>
                <Segmented
                  onChange={timeover}
                  options={options}
                />
              </ConfigProvider>
              <div className='country_pledge_showTab_right'>
                <ConfigProvider
                  theme={{
                    components: {
                      Switch: {
                        colorPrimaryHover: '#3951F1',
                      },
                    },
                  }}>
                  <Switch className='country_pledge_showTab_right_switch' defaultChecked={showTime} onChange={(checked) => { setShowTime(checked) }} />
                </ConfigProvider>
                <span>仅显示我质押的</span>
              </div>
            </div>
            <div className='country_pledge_pool'>
              {usedQuantity ? <SpinC /> : forPoolQuantity()}
            </div>
          </div>
        </div>
      }
      {
        !!tabIndex &&
        <div className='country_pc'>
          <div className='country_history'>
            < ConfigProvider
              theme={{
                components: {
                  Select: {
                    optionSelectedColor: "#3449A7",
                    optionFontSize: 12,
                    optionPadding: '10px 0',
                    selectorBg: '#EFF2FF',
                    controlItemBgActive: "rgba(213, 220, 253, 1)",
                  },
                },
              }}>
              <div className='country_history_tab'>
                {/* <div>
                <span>锁仓周期</span>
                <Select
                  style={{ color: "#3449A7" }}
                  dropdownStyle={{ textAlign: 'center', backgroundColor: "#EFF2FF" }}
                  className={'country_history_tab_select'}
                  suffixIcon={
                    <img className='country_history_tab_select_img' src={bluebottom} alt="" />
                  }
                  value={cycleList[cycle].value}
                  onChange={lockupCycle}
                  options={cycleList}
                />
              </div> */}
                <div>
                  <span>账单类型</span>
                  <Select
                    style={{ color: "#3449A7" }}
                    dropdownStyle={{ textAlign: 'center', backgroundColor: "#EFF2FF" }}
                    className={'country_history_tab_select'}
                    suffixIcon={
                      <img className='country_history_tab_select_img' src={bluebottom} alt="" />
                    }
                    value={typeList[type].value}
                    onChange={getType}
                    options={typeList}
                  />
                </div>
              </div>
              <div className='country_history_context'>
                {usedHistoryt ? <SpinC /> :
                  history.map((item, index) => {
                    return <div key={index} className='country_history_context_item'><Bill type={type} setUsedHistoryt={setUsedHistoryt} api={api} item={item} /></div>
                  })
                }
              </div>
            </ConfigProvider>
          </div>
        </div>
      }
    </div >
  )
}

export default Country