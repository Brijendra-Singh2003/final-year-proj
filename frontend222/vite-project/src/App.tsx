import React from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Doctors from './Doctors';
import Booking from './Booking';
import PatientProfile from './PatientProfile';

function App() {
  const path = window.location.pathname;
  if (path.startsWith('/doctors')) {
    return <Doctors />;
  }

  if (path.startsWith('/appointments/book')) {
    return <Booking />;
  }

  if (path.startsWith('/patients/profile')) {
    return <PatientProfile />;
  }

  if (path.startsWith('/dashboard') || path.startsWith('/appointments') || path.startsWith('/billing') || path.startsWith('/records') || path.startsWith('/patients')) {
    return <Dashboard />;
  }
  return <Login />;
}

export default App;
