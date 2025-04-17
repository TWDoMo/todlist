// src/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // 使用 Link 取代 href，避免頁面重新載入
import './Navbar.css'; // 匯入樣式表

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">📝 ToDo清單</h1>
      <ul className="nav-links">
        <li><Link to="/">首頁</Link></li>
        <li><Link to="/tasks">待辦事項</Link></li>
        <li><Link to="/tags">標籤管理</Link></li> 
        <li><Link to="/about">關於</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
