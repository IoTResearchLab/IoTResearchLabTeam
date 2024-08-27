// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can replace this part with a more secure authentication method
    if (authenticateUser(email, password)) {
      setIsAuthenticated(true);
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  const authenticateUser = (inputEmail, inputPassword) => {
    // Replace this with your authentication logic, such as an API call or environment variables
    const allowedEmail = process.env.REACT_APP_ALLOWED_EMAIL;
    const allowedPassword = process.env.REACT_APP_ALLOWED_PASSWORD;

    return inputEmail === allowedEmail && inputPassword === allowedPassword;
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
