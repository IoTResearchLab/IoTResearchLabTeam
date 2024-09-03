import React from 'react';
import './style.css'; // Import the CSS file

import { useNavigate } from 'react-router-dom';

function Project() {
  const navigate = useNavigate();

  const handleAddProjectClick = () => {
    navigate('/add-project');
  };

  const handleUpdateProjectClick = () => {
    navigate('/update-project');
  };

  return (
    <div className="team-management">
      <h2>Projects Page</h2>
      <button onClick={handleAddProjectClick} className="btn">Add Project</button>
      <button onClick={handleUpdateProjectClick} className="btn">Update Project</button>
    </div>
  );
}

export default Project;
