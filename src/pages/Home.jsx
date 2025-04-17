import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h2>歡迎來到 ToDo 清單系統 ✅</h2>
      <p>這是一個使用 <strong>React</strong> + <strong>Supabase</strong> 打造的簡易待辦事項管理工具。</p>
      <p>你可以：</p>
      <ul>
        <li>➕ 新增待辦事項</li>
        <li>✅ 標記為完成</li>
        <li>🗑️ 刪除任務</li>
        <li>📦 （進階）儲存至雲端資料庫</li>
      </ul>
      <p>👉 點上方「待辦事項」頁開始使用吧！</p>
    </div>
  );
};

export default Home;
