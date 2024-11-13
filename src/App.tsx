import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import Analysis from './components/Analysis';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

function App() {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ApiKeyProvider>
  );
}

export default App;