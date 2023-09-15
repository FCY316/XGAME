import { memo, useState } from "react";
import CounterContainer from "@/web3Hooks/useConnectedWallet";
import logo from "@/image/logo.png";
import menu from "@/image/menu.png";
import downarrow from "@/image/downarrow.png";
import walletimg from "@/image/walletimg.png";
import closeIcon from "@/image/closeIcon.png";
import copy from "@/image/copy.png";
import href from "@/image/href.png";
import home from "@/image/home.png";
import homesele from "@/image/homesele.png";
import game from "@/image/game.png";
import gamesele from "@/image/gamesele.png";
import country from "@/image/country.png";
import countrysele from "@/image/countrysele.png";
import { Button, Drawer, Menu, MenuProps, Modal } from "antd";
import { addressConvert, handleCopyClick, mobileHidden } from '@/utils/index'
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>['items'][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Header = () => {
  // 获取当前的路由路径用于判断选中的menu
  const { pathname } = useLocation()
  // 路由
  const navigate = useNavigate()
  // 获取到地址，连接钱包的方法，断开钱包的方法
  const { address, connected, breaks } = CounterContainer.useContainer();
  // 控制弹窗的参数
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 控制侧边栏的参数
  const [open, setOpen] = useState(false);
  // 打开弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };
  // 关闭弹窗
  const handleOk = () => {
    setIsModalOpen(false);
  };
  // 打开侧边栏
  const showDrawer = () => {
    setOpen(true);
  };
  // 关闭侧边栏
  const onClose = () => {
    setOpen(false);
  };
  // 侧边栏的数据
  const items: MenuProps['items'] = [
    getItem('首页', '/', <img className='header_Drawer_Menu_img' src={pathname === '/' ? homesele : home} alt="" />),
    getItem('游戏', '/game', <img className='header_Drawer_Menu_game' src={pathname === '/game' ? gamesele : game} alt="" />),
    getItem('农场', '/country', <img className='header_Drawer_Menu_country' src={pathname === '/country' ? countrysele : country} alt="" />)
    // getItem('NFT市场', 'http://www.baidu.com'),
    // getItem('社区', 'https://www.baidu.com'),

  ]
  // 去区块浏览器
  const hrefs = (url: string) => {
    return () => {
      window.open(url)
    }
  }
  // 菜单栏的结果
  const onClick: MenuProps['onClick'] = ({ key }) => {
    // 检测第一个字是不是/ 是的话路由跳转，不是的话连接跳转
    if (key.startsWith("/")) {
      navigate(key)
    } else {
      window.open(key)
    }
    onClose()
  };
  return (
    <nav className="header">
      <img className="header_logo" onClick={() => { navigate('/') }} src={logo} alt="" />
      <div className="header_center">
        <Menu className="header_center_Menu"
          onClick={onClick} selectedKeys={[pathname]} mode="horizontal" items={items} />
      </div>
      <div className="header_right">
        {address ? (
          <Button
            onClick={showModal}
            type="primary"
            className="header_right_connected"
          >
            <img
              className="header_right_connected_wallet"
              src={walletimg}
              alt=""
            />
            <img
              className="header_right_connected_downarrow"
              src={downarrow}
              alt=""
            />
          </Button>
        ) : (
          <Button type="primary" onClick={() => connected()} className="header_right_connect">
            连接钱包
          </Button>
        )}
        <div className="header_right_menu" onClick={showDrawer}>
          <img src={menu} alt="" />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[]}
        maskStyle={{
          background: "",
        }}
        closeIcon={false}
        modalRender={(modal) => {
          return <div className="header_Modal">{modal}</div>;
        }}
      >
        <div className="header_Modal_title">
          <span>我的钱包</span>{" "}
          <img onClick={handleOk} src={closeIcon} alt="" />
        </div>
        <div className="header_Modal_name">钱包地址</div>
        <div className="header_Modal_address">
          <span className="header_Modal_address_span1">{mobileHidden(addressConvert(address), 24, 3)}</span>
          <span className="header_Modal_address_span2">{addressConvert(address)}</span>
          <img
            src={copy}
            onClick={() => {
              handleCopyClick(addressConvert(address));
            }}
            alt=""
          />
        </div>
        <Button className="header_Modal_btn" onClick={() => {
          breaks(); handleOk();
        }} type="primary">
          退出钱包
        </Button>
        <div className="header_Modal_fiboscan" >
          <span onClick={hrefs('https://scan.fibochain.org/')}>View on fiboscan</span>
          <img onClick={hrefs('https://scan.fibochain.org/')} src={href} alt="" />
        </div>
      </Modal>
      <Drawer className="header_Drawer" width={'70%'} closeIcon={false} title={
        <img
          className="header_Drawer_logo"
          src={logo}
          alt=""
        />
      }
        extra={
          <img
            className="header_Drawer_closeIcon"
            onClick={onClose}
            src={closeIcon}
            alt=""
          />
        }
        placement="right" onClose={onClose} open={open}>
        <Menu
          className="header_Drawer_Menu"
          onClick={onClick}
          style={{ width: '100% ' }}
          selectedKeys={[pathname]}
          mode="inline"
          theme={'dark'}
          items={items}
        />
      </Drawer>
    </nav>
  );
};

export default memo(Header);
