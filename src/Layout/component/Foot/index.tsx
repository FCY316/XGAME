import logo from '@/image/logo.png'
import languages from '@/image/language.png'
import uparrow from '@/image/uparrow.png'
import T from '@/image/T.png'
import F from '@/image/F.png'
import X from '@/image/X.png'
import D from '@/image/D.png'
import './index.scss'
import { Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import changeLocalStorage from '@/hooks/useChangeLocalStorage'
const items: MenuProps['items'] = [
  {
    key: 'cn',
    label: '中文',
  }, {
    key: 'en',
    label: '英文',
  },
];
const Foot = () => {
  // 选择的语言
  const { language, changeLanguage } = changeLocalStorage.useContainer()
  // 翻译
  const { t, i18n } = useTranslation();
  // 跳转
  const href = (url: string) => {
    return () => {
      window.open(url)
    }
  }
  // 中英文
  const onClick: MenuProps['onClick'] = ({ key }) => {
    i18n.changeLanguage(key)
    changeLanguage(key)
  };
  return (
    <div className='foot'>
      <div className='foot_logo'>
        <img src={logo} alt="" />
      </div>
      <div className='foot_link'>
        <div className='foot_link_left'>
          <div>{t('foot.about')}</div>
          <div
            onClick={href(language === 'cn' ? 'https://docs.google.com/document/d/1eJRUiPl5IoJdqJ6dNzByf_N3upqx2wWxO__hofz2-yo/edit' : "dsa")}>{t('foot.whitePaper')}</div>

        </div>

        <Dropdown overlayClassName={'foot_link_right_item'} arrow={{ pointAtCenter: true }} menu={{ items, onClick }} placement="top" trigger={['click']}>
          <div className='foot_link_right'>
            <img src={languages} alt="" />
            <span>{language === 'cn' ? '中文' : '英文'}</span>
            <img src={uparrow} alt="" />
          </div>
        </Dropdown>
      </div>
      <div className='foot_href'>
        <div> <img className='foot_href_T' src={T} alt='' /> </div>
        <div> <img className='foot_href_D' src={D} alt='' /> </div>
        <div> <img className='foot_href_X' src={X} alt='' /> </div>
        <div> <img className='foot_href_F' src={F} alt='' /> </div>
      </div>
    </div>
  )
}

export default Foot