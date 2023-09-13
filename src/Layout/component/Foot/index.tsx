import React, { useState } from 'react'
import logo from '@/image/logo.png'
import language from '@/image/language.png'
import uparrow from '@/image/uparrow.png'
import T from '@/image/T.png'
import F from '@/image/F.png'
import X from '@/image/X.png'
import D from '@/image/D.png'
import './index.scss'
import { Dropdown, MenuProps } from 'antd'
const items: MenuProps['items'] = [
  {
    key: 'zn',
    label: '中文',
  }, {
    key: 'en',
    label: '英文',
  },
];
const Foot = () => {
  // 跳转
  const href = (url: string) => {
    return () => {
      window.location.href = url
    }
  }
  // 中英文
  const onClick: MenuProps['onClick'] = ({ key }) => {
    console.log(`Click on item ${key}`);
  };
  return (
    <div className='foot'>
      <div className='foot_logo'>
        <img src={logo} alt="" />
      </div>
      <div className='foot_link'>
        <div className='foot_link_left'>
          <div>关于</div>
          <div>白皮书</div>

        </div>

        <Dropdown overlayClassName={'foot_link_right_item'} arrow={{ pointAtCenter: true }} menu={{ items, onClick }} placement="top" trigger={['click']}>
          <div className='foot_link_right'>
            <img src={language} alt="" />
            <span>中文</span>
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