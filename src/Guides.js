import React from "react";
import { useNavigate } from "react-router-dom";
import './style.css'; // Import the CSS file

function Guides  ()  {
    const navigate = useNavigate();

  const handleTeammembersguideClick = () => {
    navigate('/team-members-guide');
  };

  const handleProjectsguideClick = () => {
    navigate('/projects-guide');
  };
  const handlePublicationsguideClick = () => {
    navigate('/publications-guide');
  };
    return ( 
<div className="team-management">
      <h2>Guides Page</h2>
      <button onClick={handleTeammembersguideClick} className="btn">Team Members Guide</button>
      <button onClick={handleProjectsguideClick} className="btn">Projects Guide</button>
      <button onClick={handlePublicationsguideClick} className="btn">Publications Guide</button>

    </div>
     );
};

export default Guides;