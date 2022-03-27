import React from 'react';
import Signup from './Auth/Signup';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Navigate, Routes, Route } from 'react-router-dom';
import LoginLanding from './Auth/LoginLanding';
import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import { ProfileDataProvider } from '../contexts/ProfileDataContext';
import '../css/bitacora.css'
import FlightNavigate from './Flight/FlightNavigate';
import FlightContextProvider from '../contexts/FlightContext';
import BulkNavigate from './Bulk/BulkNavigate';
import FlightBook from './Book/FlightBook';
import DbFlightContextProvider from '../contexts/DbFlightContext';

function App() {
  return (
    <>
      <Navigate basename={`${process.env.PUBLIC_URL}`}>
        <AuthProvider>
          <ProfileDataProvider>
            <DbFlightContextProvider>
              <FlightContextProvider>
                <Routes>
                  <Route path="/" element={<LoginLanding />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/newflight" element={<FlightNavigate newFlight={true} />} />
                  <Route path="/bulk" element={<BulkNavigate />} />
                  <Route path="/book" element={<FlightBook />} />
                  <Route path="/dbflight" element={<FlightNavigate newFlight={false} />} />
                </Routes>
              </FlightContextProvider>
            </DbFlightContextProvider>
          </ProfileDataProvider>
        </AuthProvider>
      </Navigate>
    </>
  );
}

export default App;
