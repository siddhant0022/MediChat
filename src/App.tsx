'use client'


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/homePage" 
import { Chat } from "./components/chatScreen";


function App() {
  return (
    
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  )
}


export default App