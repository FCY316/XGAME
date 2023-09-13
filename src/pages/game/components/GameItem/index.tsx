import './index.scss'
import rightarrow2 from '@/image/rightarrow2.png'
type gameListitem = {
    gameImg: string,
    href: string,
    userImg: string,
    userName: string,
    context: string
}
const GameItem = (props: { item: gameListitem }) => {
    const { gameImg,
        href,
        userImg,
        userName,
        context } = props.item
    return (
        <div className='gameItem'>
            <div className='gameItem_img'>
                <img src={gameImg} alt="" />
            </div>
            <div className='gameItem_user'>
                <img src={userImg} alt="" />
                {userName}
            </div>
            <div className='gameItem_text'>
                {context}
            </div>
            <div className='gameItem_btn'>
                <div onClick={() => {
                    window.location.href = href
                }}>
                    <span>探索</span>
                    <img src={rightarrow2} alt="" />
                </div>
            </div>
        </div>
    )
}

export default GameItem