import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
