import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CRM from './Pages/CRM';
import S1 from './Pages/S1';
import S2 from './Pages/S2';
import S3 from './Pages/S3';



function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route exact path="/" element={<CRM />} />
        <Route path="/S1" element={<S1 />} />
        <Route path="/S2" element={<S2 />} />
        <Route path="/S3" element={<S3 />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
