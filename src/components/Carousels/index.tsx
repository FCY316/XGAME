import { Carousel } from 'antd'
import './index.scss'
import {slideshow} from '@/data'
type slideshowItemType = {
    imgUrl: string,
    href: string
}
const Carousels = () => {
    const href = (url:string)=>{
      return ()=>{
        window.open(url)
      }
    }
    // 获取到json数据
    return (
        <div className='banner'>
            <Carousel autoplay dots={{ className: 'banner_dots' }}>
                {slideshow.map((item: slideshowItemType) => {
                    return <div onClick={href(item.href)} key={item.href} className="banner_img">
                        <img src={item.imgUrl} alt="" />
                    </div>
                })}
            </Carousel>
        </div>
    )
}

export default Carousels