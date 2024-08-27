import { Routes, Route,Router, Navigate } from 'react-router-dom';
import React, { useState } from 'react';

import AddTeamMember from './AddTeamMember';
import Navbar from './Navbar';
import Home from './Home';
import AddPublication from './AddPublication';
import AddProject from './AddProject';
import Login from './login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router basename={process.env.PUBLIC_URL}>
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
    </Router>
  );
}

export default App;
