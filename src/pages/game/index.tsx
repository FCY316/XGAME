import Carousels from '@/components/Carousels'
import './index.scss'
import GameItem from './components/GameItem'
const data = require('@/data.json')
type gameListitem = {
  gameImg: string,
  href: string,
  userImg: string,
  userName: string,
  context: string
}
const Game = () => {
  const { gameList } = data
  return (
    <div className='game'>
      <div className='game_banner'>
        <Carousels />
      </div>
      <div className='game_context'>
        <div className='game_context_title'>游戏</div>
        <div className='game_context_list'>
          {gameList.map((item: gameListitem, index: number) => {
            return <div key={index} className='game_context_list_item'>
              <GameItem item={item} />
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Game