import Carousels from '@/components/Carousels'
import './index.scss'
import GameItem from './components/GameItem'
import { gameList } from '@/data'
type gameListitem = {
  gameImg: string,
  href: string,
  userImg: string,
  userName: string,
  context: string,
  color: string
}
const Game = () => {
  return (
    <div className='game'>        <div className='game_pc'>
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

    </div>
  )
}

export default Game