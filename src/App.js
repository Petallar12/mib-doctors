import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Doctor from './components/Doctor';
import DoctorDetail from './components/DoctorDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mib-doctors/" element={<Doctor />} />
        <Route path="/mib-doctors/doctor/:id" element={<DoctorDetail />} />
      </Routes>
    </Router>
  );
}

export default App;