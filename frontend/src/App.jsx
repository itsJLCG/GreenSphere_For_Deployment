import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Feedback from './components/Feedback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AdminHome from './components/admin/AdminHome';
import LandingPage from './components/LandingPage';
import OtpVerification from './components/OtpVerification';
import Analysis from './components/Analysis';
import { HomeProvider } from './components/HomeContext';

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();
export const UserRoleContext = createContext();
export const SetUserRoleContext = createContext();
export const UserNameContext = createContext(); // ✅ Store User Name
export const SetUserNameContext = createContext(); // ✅ Allow Updates to Name

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(""); // ✅ Store User's Name

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.data.user) {
                    setIsLoggedIn(true);
                    setUserRole(response.data.user.role);
                    setUserName(response.data.user.name);
                } else {
                    setIsLoggedIn(false);
                    setUserRole(null);
                    setUserName("");
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUserRole(null);
                setUserName("");
            });
    }, [isLoggedIn]);

    return (
        <HomeProvider>
            <IsLoggedInContext.Provider value={isLoggedIn}>
                <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
                    <UserRoleContext.Provider value={userRole}>
                        <SetUserRoleContext.Provider value={setUserRole}>
                            <UserNameContext.Provider value={userName}>
                                <SetUserNameContext.Provider value={setUserName}>
                                    <BrowserRouter>
                                        <Navbar />
                                        <Routes>
                                            <Route path="/" element={<LandingPage />} />  {/* ✅ Allow everyone to visit `/` */}
                                            <Route path="/landingpage" element={<LandingPage />} />
                                            <Route path="/signup" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? "/adminhome" : "/home"} /> : <Signup />} />
                                            <Route path="/login" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? "/adminhome" : "/home"} /> : <Login />} />
                                            <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                                            <Route path="/feedback" element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />} />
                                            <Route path="/adminhome" element={isLoggedIn && userRole === "admin" ? <AdminHome /> : <Navigate to="/home" />} />
                                            <Route path="/verify-otp" element={<OtpVerification />} />
                                            <Route path="/analysis" element={<Analysis />} />
                                        </Routes>
                                    </BrowserRouter>
                                    <ToastContainer position="top-right" autoClose={3000} />
                                </SetUserNameContext.Provider>
                            </UserNameContext.Provider>
                        </SetUserRoleContext.Provider>
                    </UserRoleContext.Provider>
                </SetIsLoggedInContext.Provider>
            </IsLoggedInContext.Provider>
        </HomeProvider>
    );
}

export default App;
