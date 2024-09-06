import React, { useState } from 'react';
import './AddTeamMember.css';

function AddPublication() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [authors, setAuthors] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const publication = {
      title,
      url,
      authors,
      publisher,
      year: parseInt(year),
    };

    const response = await fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/addPublication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });

    if (response.ok) {
      alert('Publication added successfully!');
      setTitle('');
      setUrl('');
      setAuthors('');
      setPublisher('');
      setYear('');
    } else {
      alert('Failed to add publication.');
    }
  };

  return (
    <div className="add-teammember-container">

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
        <label>Publication URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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
        <label>Publisher:</label>
        <input
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
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
      <button type="submit" >Add Publication</button>
    </form>
    </div>
  );
}

export default AddPublication;
