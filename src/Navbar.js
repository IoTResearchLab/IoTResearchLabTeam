import "./Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-icon">
        <img src='https://media.licdn.com/dms/image/v2/D560BAQEhB_l7NVlRJA/company-logo_200_200/company-logo_200_200/0/1719603218595?e=1732752000&v=beta&t=Sva0AMyMl_6UuGgjts_SIAvmSKjSL9bCUm52LR8lw2Q' alt="icon" />
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-team-member">New Member</Link>
        </li>
        <li>
          <Link to="/add-publication">New Publication</Link>
        </li>
        <li>
          <Link to="/add-project">New Project Page</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
