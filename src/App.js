import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AddTeamMember from './AddTeamMember';
import Navbar from './Navbar';
import Home from './Home';
import AddPublication from './AddPublication';
import AddProject from './AddProject';
import Login from './login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {!isAuthenticated ? (
          <Route 
            path="/*" 
            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
          />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/add-team-member" element={<AddTeamMember />} />
            <Route path="/add-publication" element={<AddPublication />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
