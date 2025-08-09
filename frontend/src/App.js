import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import DiscoverPage from "./pages/DiscoverPage";
import HistoryPage from "./pages/HistoryPage";
import { SwipeProvider } from "./context/SwipeContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <SwipeProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </SwipeProvider>
    </div>
  );
}

export default App;