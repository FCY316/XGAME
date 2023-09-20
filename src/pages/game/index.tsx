import Carousels from '@/components/Carousels'
import './index.scss'
import GameItem from './components/GameItem'
import { gameList } from '@/data'
import { useTranslation } from 'react-i18next'
type gameListitem = {
  gameImg: string,
  href: string,
  userImg: string,
  userName: string,
  context: string,
  color: string
}
const Game = () => {
  // 翻译
  const { t } = useTranslation()
  return (
    <div className='game'>
      <div className='game_pc'>
        <div className='game_banner'>
          <Carousels />
        </div>
        <div className='game_context'>
          <div className='game_context_title'>{t('game.game')}</div>
          <div className='game_context_list'>
            {gameList.map((item: gameListitem, index: number) => {
              return <div key={index} className='game_context_list_item'>
                <GameItem item={item} />
              </div>
            })}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Game