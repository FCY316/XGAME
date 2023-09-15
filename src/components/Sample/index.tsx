import { logoList } from '@/abi/tokenAddress'
import './index.scss'


const Sample = (props: { logo1: string, logo2: string }) => {
    const { logo1, logo2 } = props
    return (
        <>
            {
                <div className='poolItem'>
                    <div className='poolItem_tokenInfo'>
                        <div className='poolItem_tokenInfo_left'>
                            <div className='poolItem_tokenInfo_left_img'>
                                <img src={logoList[logo1]} alt="" />
                                <img src={logoList[logo2]} alt="" />
                            </div>
                            <div className='poolItem_tokenInfo_left_text'>
                                <div>赚取--</div>
                                <div>质押--</div>
                            </div>
                        </div>
                        <div className='poolItem_tokenInfo_right'>
                            APR：--
                        </div>
                    </div>
                    <div className='poolItem_earnings'>
                        <div>
                            <div>已赚取--</div>
                            <div>
                                --
                            </div>
                        </div>
                        <div>
                            <div>TVL</div>
                            <div>
                                --
                            </div>
                        </div>
                        <div>
                            <div>结束倒计时</div>
                            <div>
                                --
                            </div>
                        </div>
                    </div>
                    <div className={'poolItem_unfold'}>
                        <span>敬请期待～～</span>
                    </div>
                </div>
            }
        </>

    )
}

export default Sample