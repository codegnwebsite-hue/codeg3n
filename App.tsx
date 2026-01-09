
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SessionPage from './pages/SessionPage';
import VerifyHandler from './pages/VerifyHandler';
import ApiGenerate from './pages/ApiGenerate';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Real API Endpoint path (No #) */}
            <Route path="/api/generate" element={<ApiGenerate />} />
            {/* Clean unique URL path (No #) */}
            <Route path="/v/:slug" element={<SessionPage />} />
            {/* Logic-only verification route */}
            <Route path="/verify" element={<VerifyHandler />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
