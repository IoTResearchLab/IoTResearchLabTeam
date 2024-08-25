import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './AddTeamMember.css';

const allowedEmail = "Mostafa.abdelrashid4@gmail.com";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function signIn(e) {
    e.preventDefault();
    if (email !== allowedEmail) {
      alert("Access denied: This email is not allowed.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Access granted");
        // Redirect to the protected area of your app
        navigate('/'); // Redirect to home or another route after login
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        alert("Login failed.");
      });
  }

  return (
    <form onSubmit={signIn}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}

export default Login;
