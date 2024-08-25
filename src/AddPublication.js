import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import './AddTeamMember.css';

function AddPublication() {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to add a publication.');
      return;
    }

    const publication = {
      title,
      authors,
      journal,
      year: parseInt(year),
      type,
      pdfUrl
    };

    const response = await fetch('https://team-website-backend.fly.dev/addPublication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });

    if (response.ok) {
      alert('Publication added successfully!');
      setTitle('');
      setAuthors('');
      setJournal('');
      setYear('');
      setType('');
      setPdfUrl('');
    } else {
      alert('Failed to add publication.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Authors:</label>
        <input
          type="text"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Journal:</label>
        <input
          type="text"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Type:</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>
      <div>
        <label>PDF URL:</label>
        <input
          type="text"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={!user}>Add Publication</button>
    </form>
  );
}

export default AddPublication;
