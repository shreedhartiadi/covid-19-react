
import React, { useState, useEffect } from "react";
import {Link,NavLink} from 'react-router-dom'
import "./Header.css"
import { CSSTransition } from "react-transition-group";

export default function Header() {
  const [isNavVisible, setNavVisibility] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const handleMediaQueryChange = mediaQuery => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  const style={ color:"#000"
  }

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  const onSuccess = () =>{}

  const onError = () =>{}

  const share = () => {
    const title = "COVID-19 | India Dashboard",text="Statewise Statistics of Coronavirus Cases in India",url="www.curecovid19.in";
    if (window.navigator.share) {
      window.navigator.share({ title, text, url })
        .then(onSuccess)
        .catch(onError);
    } else {
      alert("Your Mobile Browser does not support Share.")
      console.log("not support");
    }

  };

  return (<>
    <div className="menu-mobile menu-activated-on-click color-scheme-light">
           <div className="mm-logo-buttons-w">
             <Link className="mm-logo" to="/" onClick={() => window.location="/"}><img src="img/logos2.png"/><span></span></Link>
            <div className="mm-buttons">
              <div className="mobile-menu-trigger">                 
              <div onClick={toggleNav} className="fa fa-bars"><svg height="30" width="12" className="blinking"><circle cx="5" cy="5" r="4" fill="red" /></svg></div>
              <div onClick={share} className="fa fa-share-alt"></div>
              </div>
              
             </div>
           </div>

      <CSSTransition
        in={!isSmallScreen || isNavVisible}
        timeout={350}
        classNames="NavAnimation"
        unmountOnExit>
        <nav className="Nav">
           <NavLink to="/">Home</NavLink >             
           <NavLink to="/help">Helpline No.s</NavLink >
           <NavLink to="/about">About</NavLink >               
           <NavLink to="/updates">News & Updates <svg height="20" width="10" className="blinking"><circle cx="5" cy="5" r="4" fill="red" /></svg></NavLink >               
         </nav>
        </CSSTransition>
       </div>

    <div className="menu-w color-scheme-light fixed-top color-style-default menu-position-top menu-layout-compact sub-menu-style-over sub-menu-color-bright selected-menu-color-bright menu-activated-on-hover menu-has-selected-link">
       <div className="logo-w">
           <div className="logo-w menu-size">
                <Link  to="/" className="logo" onClick={() => window.location="/"}>
                <img src='img/logos2.png' className="Logo" alt="logo" />
                 </Link >
           </div>
           </div>
     
     
        <div className="top-bar color-scheme-light">
       
        <ul>
              <li>
                 <NavLink exact to="/" activeStyle={style}>Home</NavLink >
              </li>
              <li>
                 <NavLink exact to="/help" activeStyle={style}>Helpline No.s</NavLink >
              </li>
              <li>
                 <NavLink exact to="/about" activeStyle={style}>About</NavLink >
              </li>
              <li>
                 <NavLink exact to="/updates" activeStyle={style}>News & Updates <svg height="20" width="10"><circle cx="3" cy="5" r="3" fill="red" /></svg></NavLink >
              </li>
            </ul> 
        </div>
    </div>
    </>
  );
}


// {
//   content: "";
//   position: absolute;
//   bottom: 0px;
//   left: 50%;
//   transform: translateX(-50%);
//   height: 2px;
//   transition: all 0.2s ease;
// }