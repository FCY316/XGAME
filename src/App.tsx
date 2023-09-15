import React from 'react';
import AppRouter from '@/router'
import { ConfigProvider } from 'antd';

import './App.css';
// import "@/log/index";
function App() {

  return (
    <div className="App">
      {/* 在这写为了快，后期会更改 */}
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: '#2901E8',
              algorithm: true, // 启用算法
            },
            Modal: {
              contentBg: 'transparency',
              boxShadow: '0 6px 16px 0 transparency, 0 3px 6px -4px transparency, 0 9px 28px 8px transparency ',
              algorithm: true, // 启用算法
            },
            Drawer: {
              colorBgElevated: '#141414',
              colorSplit: 'rgba(163, 120, 226, 0.2)'
            },
            Menu: {
              darkItemBg: 'transparency',
              subMenuItemBorderRadius: 0,
              itemBorderRadius: 0,
              itemMarginInline: 0,
              darkItemColor: '#fff',
              darkItemSelectedBg: 'transparency',
              darkItemSelectedColor: '#5370FF'
            },
            Popover: {
              colorBgElevated: '#A1ADEE',
              colorText: "#fff"
            },
            Notification: {
              controlHeightLG: 10
            }
          },
        }}
      >
        <AppRouter />
      </ConfigProvider>
    </div >
  );
}

export default App;
