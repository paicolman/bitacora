import React from 'react';
import Signup from './Auth/Signup';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Navigate, Routes, Route } from 'react-router-dom';
import LoginLanding from './Auth/LoginLanding';
import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import { ProfileDataProvider } from '../contexts/ProfileDataContext';
import '../css/bitacora.css'
import NewFlight from './Flight/NewFlight';
import FlightContextProvider from '../contexts/FlightContext';
import BulkUploadDropzone from './Bulk/BulkUploadDropzone';

function App() {
  return (
    <>
      <Navigate>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={
              <>
                <ProfileDataProvider>
                  <LoginLanding />
                </ProfileDataProvider>
              </>
            }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/newflight" element={
              <>
                <AuthProvider>
                  <ProfileDataProvider>
                    <FlightContextProvider>
                      <NewFlight />
                    </FlightContextProvider>
                  </ProfileDataProvider>
                </AuthProvider>
              </>
            }
            />
            <Route exact path="/bulk" element={
              <>
                <AuthProvider>
                  <ProfileDataProvider>
                    <FlightContextProvider>
                      <BulkUploadDropzone />
                    </FlightContextProvider>
                  </ProfileDataProvider>
                </AuthProvider>
              </>
            }
            />
          </Routes>
        </AuthProvider>
      </Navigate>
    </>
  );
}

export default App;
