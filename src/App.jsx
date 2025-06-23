import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotPage from "@/pages/ChatbotPage";
import Beranda from "@/pages/Beranda"; // Tambahkan ini
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Beranda />} /> {/* Ini halaman utama */}
          <Route path="/chatbot" element={<ChatbotPage />} />{" "}
          {/* Ini halaman chatbot */}
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
