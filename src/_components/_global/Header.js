import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/Header.css";
import {AuthContext} from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const [isStickyHeader, setStickyHeader] = useState(false);
  const [isStickyHeaderMobile, setStickyHeaderMobile] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 210) {
        setStickyHeader(true);
        setStickyHeaderMobile(true);
      } else {
        setStickyHeader(false);
        setStickyHeaderMobile(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogOut = () => {
    logout();
    alert("Logout successful");
  };
  return (
    <>
      {/* Full Header: Visible initially */}
      <header>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="container top-bar">
            <div>
              <p>Suite R23, 1111 St.Urbain, Montreal Quebec H2Z 1Y6</p>
            </div>
            <div className="account-section">
              {!auth.isLoggedIn ? (
              <a href="/login">Login</a>
                  ) : (
                    <a onClick={handleLogOut}>Logout</a>
                    )}
              <a href="#">My Account</a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="main-header container">
          <div className="logo">
            <a href="/">
              <img
                src="https://www.city-getaways.com/image/catalog/city/logo/logocity.jpg"
                alt="City Getaways"
              />
            </a>
          </div>

          {/* Search Bar and Cart Section */}
          <div className="search-bar">
            <select>
              <option>All Categories</option>
            </select>
            <input type="text" placeholder="Search" />
            <button type="submit" className="btn-default">
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className="cart-section">
            <button className="wishlist-btn btn-default">
              <i className="fa fa-heart"></i>
            </button>
            <div className="cart-info">
              <button className="btn-default cart-btn" onClick={() => navigate('/cart')}>
                <i className="fa fa-shopping-cart"></i>
              </button>
              {/* <p>
                <span style={{ float: "left", fontWeight: "bold" }}>
                  MY CART
                </span>
                <br />0 item(s) - <span>$0.00</span>
              </p> */}
            </div>
          </div>
        </div>

        {/* Navigation and Hamburger Icon */}
        <nav className="main-nav mobile-main-nav ">
          {/* Hamburger icon visible only on mobile */}
          <button className="hamburger" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Links */}
          <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
            <li><a href="/">HOME</a></li>
            <li><a href="/">ABOUT US</a></li>
            <li><a href="/">CONTACT US</a></li>
            <li><a href="/">NEWS</a></li>
          </ul>
        </nav>
      </header>

      {/* Sticky Nav Bar: Visible only when scrolling past a certain point */}
      <nav className={`main-nav ${isStickyHeader ? "visible" : "hidden"}`}>
        <ul className="container">
          <li><a href="/">HOME</a></li>
          <li><a href="/">ABOUT US</a></li>
          <li><a href="/">CONTACT US</a></li>
          <li><a href="/">NEWS</a></li>
        </ul>
      </nav>

      {/* Sticky Nav Bar: Visible only when scrolling past a certain point */}
      <nav className={`main-nav mobile-main-nav ${isStickyHeaderMobile ? "visible" : "hidden"}`}>
        {/* Hamburger icon visible only on mobile */}
        <button className="hamburger" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Links */}
          <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
            <li><a href="/">HOME</a></li>
            <li><a href="/">ABOUT US</a></li>
            <li><a href="/">CONTACT US</a></li>
            <li><a href="/">NEWS</a></li>
          </ul>
      </nav>
    </>
  );
}

export default Header;
