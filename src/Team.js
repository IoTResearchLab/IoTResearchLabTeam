import React from 'react';
import './style.css'; // Import the CSS file

import { useNavigate } from 'react-router-dom';

function Team() {
  const navigate = useNavigate();

  const handleAddTeamMemberClick = () => {
    navigate('/add-team-member');
  };

  const handleUpdateTeamMemberClick = () => {
    navigate('/update-team-member');
  };

  return (
    <div className="team-management">
      <h2>Team Members Page</h2>
      <button onClick={handleAddTeamMemberClick} className="btn">Add Team Member</button>
      <button onClick={handleUpdateTeamMemberClick} className="btn">Update Team Member</button>
    </div>
  );
}

export default Team;
