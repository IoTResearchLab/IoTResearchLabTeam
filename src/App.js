import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UpdateProject from './UpdateProject';
import AddTeamMember from './AddTeamMember';
import UpdateTeamMember from './UpdateTeamMember';
import Team from './Team'; 
import Navbar from './Navbar';
import Home from './Home';
import AddPublication from './AddPublication';
import AddProject from './AddProject';
import Login from './login';
import Project from './Project';
import Publication from './Publication';
import UpdatePublication from './UpdatePublication';
import Guides from './Guides';
import Teammembersguide from './Teammembersguide';
import Publicationsguide from './Publicationsguide';
import Projectsguide from './Projectsguide';

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
            <Route path="/team" element={<Team />} />
            <Route path="/project" element={<Project />} /> 
            <Route path="/publication" element={<Publication/>} /> 
            <Route path="/add-team-member" element={<AddTeamMember />} />
            <Route path="/update-team-member" element={<UpdateTeamMember />} />
            <Route path="/add-publication" element={<AddPublication />} />
            <Route path="/update-publication" element={<UpdatePublication />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/update-project" element={<UpdateProject />} /> 
            <Route path="/guides" element={<Guides/>}/>
            <Route path="/team-members-guide" element={<Teammembersguide/>}/>
            <Route path="/publications-guide" element={<Publicationsguide/>}/>
            <Route path="/projects-guide" element={<Projectsguide/>}/>



            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
