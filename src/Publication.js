import React from 'react';
import './style.css'; // Import the CSS file

import { useNavigate } from 'react-router-dom';

function Publication() {
  const navigate = useNavigate();

  const handleAddPubClick = () => {
    navigate('/add-publication');
  };

  const handleUpdatePubClick = () => {
    navigate('/update-publication');
  };

  return (
    <div className="team-management">
      <h2>Publications Page</h2>
      <button onClick={handleAddPubClick} className="btn">Add Publication</button>
      <button onClick={handleUpdatePubClick} className="btn">Update Publication</button>
    </div>
  );
}

export default Publication;
