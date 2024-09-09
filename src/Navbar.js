import React, { useState } from 'react';
import "./Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-icon">
        <img
          src="https://media.licdn.com/dms/image/v2/D560BAQEhB_l7NVlRJA/company-logo_200_200/company-logo_200_200/0/1719603218595?e=1732752000&v=beta&t=Sva0AMyMl_6UuGgjts_SIAvmSKjSL9bCUm52LR8lw2Q"
          alt="icon"
        />
      </div>
      <div className="navbar-hamburger" onClick={toggleMenu}>
        &#9776; {/* Hamburger Icon */}
      </div>
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/team" onClick={() => setMenuOpen(false)}>Team Members</Link>
        </li>
        <li>
          <Link to="/publication" onClick={() => setMenuOpen(false)}>Publications</Link>
        </li>
        <li>
          <Link to="/project" onClick={() => setMenuOpen(false)}>Projects</Link>
        </li>
        <li>
          <Link to="/guides" onClick={() => setMenuOpen(false)}>Guides</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
