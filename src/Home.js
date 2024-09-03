import React from "react";
import { Link } from "react-router-dom";
import './Home.css';  // Import the CSS file for styling

const Home = () => {
  return (
    <div >

      <h1>IoT Research Lab Team Website</h1>
     
      <div className="button-group">
        <Link to="/team">
          <button className="home-button">Team Members</button>
        </Link>
        <Link to="/publication">
          <button className="home-button">Publications</button>
        </Link>
        <Link to="/project">
          <button className="home-button">Projects</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
