import { Button } from "antd"
import './index.scss'
import broccoli from '@/image/broccoli.png'
import pay from '@/image/pay.png'
import friday from '@/image/friday.png'
import rightarrow from '@/image/rightarrow.png'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Carousels from "@/components/Carousels"
import { hot, country } from '@/data'
type slideshowItemType = {
  imgUrl: string,
  href: string
}

const Home = () => {

  // 初始化路由
  const navigate = useNavigate()
  return (
    <div className="home">
      <div className="home_carousel">
        <div className="pc1200">
          <div className="home_carousel_banner">
            <Carousels />
          </div>
          <div className="home_carousel_hot">
            <div className="home_carousel_hot_title">🔥热门游戏</div>
            <EmoCarousel></EmoCarousel>
            <Button onClick={() => { navigate('/game') }} className="home_carousel_hot_btn" type="primary">查看更多</Button>
          </div>
        </div>
      </div>
      <div className="home_country">
        <div className="pc1200">
        <div className="home_country_title">
          <span>农场</span>
          <img src={broccoli} alt="" />
        </div>
        <div className="home_country_banner">
          <img src={country.imgUrl} alt="" />
        </div>
        <Button onClick={() => { navigate('/country') }} className="home_country_btn" type="primary">
          <span>探索</span> <img src={rightarrow} alt="" />
        </Button>
        </div>
      </div>
      <div className="home_bg">
        <div></div>
      </div>
      <div className="home_partner">
        <div className="home_partner_title">合作伙伴</div>
        <div className="home_partner_img">
          <img src={friday} alt="" />
          <img src={pay} alt="" />
        </div>
      </div>
    </div >
  )
}
const EmoCarousel = () => {
  const clsRef = useRef(['one', 'two', 'three', 'four', 'five', 'six'])
  const dotsRef = useRef(['change', '', '', ''])
  const [cls, setCls] = useState([''])
  // 跳转
  const href = (url: string) => {
    return () => {
      window.open(url)
    }
  }
  useEffect(() => {
    setCls([...clsRef.current])
    const time = setInterval(() => {
      const clsTmp = [...clsRef.current]
      const dotsTmp = [...dotsRef.current]
      let tmp = String(clsTmp.pop())
      clsTmp.unshift(tmp)
      let dotTmp = String(dotsTmp.pop())
      dotsTmp.unshift(dotTmp)
      setCls(clsTmp)
      clsRef.current = clsTmp
      dotsRef.current = dotsTmp
    }, 3000)
    return () => clearInterval(time)
  }, [])

  return (
    <div className="box">
      <ul className='imgs'>
        {hot.map((item: slideshowItemType, index: number) => {
          return <li onClick={href(item.href)} key={item.href + '' + index} className={cls[index]}>
            <img src={item.imgUrl} alt="" />
          </li>
        })}
      </ul>
    </div>
  )
}
export default Home