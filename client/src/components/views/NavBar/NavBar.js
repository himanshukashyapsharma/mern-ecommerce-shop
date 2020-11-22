import React, { useState,useEffect } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button, Icon } from 'antd';
import './Sections/Navbar.css';

function NavBar() {

  const [visible, setVisible] = useState(false)
  const [navStyle, setNavStyle] = useState({ 
    position: 'fixed',
    zIndex: 5, 
    width: '100%', 
  })

  useEffect(() => {
    // let newNavStyle = navStyle
    let nav = document.querySelector("#nav")
    window.addEventListener('scroll', () => {
      // this method creates a sudden trasition rather than a smooth one
      // if(window.pageYOffset < 300){
      //   setNavStyle({...newNavStyle, height: '50px'})
      //   setNavStyle({...newNavStyle})
      // } else{
      //   setNavStyle({...navStyle, height: '0px'})
      // }
      if(window.pageYOffset < 300){
        nav.classList.remove("hide-nav")
      }else{
        nav.classList.add("hide-nav")
      }
    });
  },[])


  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <nav className="menu" id="nav" style={navStyle}>
      <div className="menu__logo">
        <a href="/">Logo</a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar