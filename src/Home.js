import React from "react";
import { Link } from "react-router-dom";
import './Home.css';  // Import the CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <h1>This is the Home Page</h1>
      <div className="button-group">
        <Link to="/add-team-member">
          <button className="home-button">Add Team Member</button>
        </Link>
        <Link to="/add-publication">
          <button className="home-button">Add Publication</button>
        </Link>
        <Link to="/add-project">
          <button className="home-button">Add Project</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
