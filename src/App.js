import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Tags from './pages/Tags';
import './App.css'; // 保留你原本的 CSS

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tags" element={<Tags />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
