import { useTranslation } from 'react-i18next'
import './index.scss'
import rightarrow2 from '@/image/rightarrow2.png'
type gameListitem = {
    gameImg: string,
    href: string,
    userImg: string,
    userName: string,
    context: string,
    color: string
}
const GameItem = (props: { item: gameListitem }) => {
    const { gameImg,
        href,
        userImg,
        userName,
        context } = props.item
    // 翻译
    const { t } = useTranslation()
    return (
        <div className='gameItem' >
            <div className='gameItem_img'>
                <img src={gameImg} alt="" />
            </div>
            <div className='gameItem_user'>
                <div className='gameItem_user_img'><img src={userImg} alt="" /></div>
                {userName}
            </div>
            <div className='gameItem_text'>
                {context}
            </div>
            <div className='gameItem_btn'>
                <div onClick={() => {
                    window.open(href)
                }}>
                    <span>{t('game.explore')}</span>
                    <img src={rightarrow2} alt="" />
                </div>
            </div>
        </div>
    )
}

export default GameItem