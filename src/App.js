import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Doctor from './components/Doctor';
import DoctorDetail from './components/DoctorDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Doctor />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
