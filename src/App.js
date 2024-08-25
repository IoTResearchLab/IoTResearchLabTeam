import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';  // No need to import BrowserRouter or Router here
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import AddTeamMember from './AddTeamMember';
import Login from './login';
import Navbar from './Navbar';
import Home from './Home';
import AddPublication from'./AddPublication';
import AddProject from './AddProject'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-team-member" element={<AddTeamMember />} />
            <Route path="/add-publication" element={<AddPublication />} />
            <Route path="/add-project" element={<AddProject />} />


            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
