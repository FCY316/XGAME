import { Carousel } from 'antd'
import './index.scss'
const data = require('@/data.json')
type slideshowItemType = {
    imgUrl: string,
    href: string
}
const Carousels = () => {
    // 获取到json数据
    const { slideshow } = data
    return (
        <div className='banner'>
            <Carousel autoplay dots={{ className: 'banner_dots' }}>
                {slideshow.map((item: slideshowItemType) => {
                    return <div key={item.href} className="banner_img">
                        <img src={item.imgUrl} alt="" />
                    </div>
                })}
            </Carousel>
        </div>
    )
}

export default Carousels