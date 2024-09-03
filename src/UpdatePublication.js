import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";

function UpdatePublication() {
  const [publications, setPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
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

  useEffect(() => {
    fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/publications')
      .then(response => response.json())
      .then(data => setPublications(data))
      .catch(error => console.error('Error fetching publications:', error));
  }, []);

  const handleSelectChange = (e) => {
    const publicationId = e.target.value;
    const publication = publications.find(p => p._id === publicationId);
    setSelectedPublication(publication);
    setTitle(publication.title);
    setAuthors(publication.authors);
    setJournal(publication.journal);
    setYear(publication.year);
    setType(publication.type);
    setPdfUrl(publication.pdfUrl);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to update a publication.');
      return;
    }

    const updatedPublication = {
      title,
      authors,
      journal,
      year: parseInt(year),
      type,
      pdfUrl
    };

    try {
      const response = await fetch(`https://iot-backend-server-sparkling-sun-1719.fly.dev/updatePublication/${selectedPublication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPublication),
      });

      if (response.ok) {
        alert('Publication updated successfully!');
        setSelectedPublication(null); // Reset the form after successful update
      } else {
        const errorData = await response.json();
        alert(`Failed to update publication: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating publication:', error);
      alert('An error occurred while updating the publication.');
    }
  };

  return (
    <div className="update-publication-container">
      <h3>Update Publication</h3>
      <div>
        <label>Select a Publication:</label>
        <select onChange={handleSelectChange} value={selectedPublication ? selectedPublication._id : ''}>
          <option value="" disabled>Select...</option>
          {publications.map(publication => (
            <option key={publication._id} value={publication._id}>
              {publication.title}
            </option>
          ))}
        </select>
      </div>

      {selectedPublication && (
        <form onSubmit={handleUpdate}>
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
          <button type="submit" disabled={!user}>Update Publication</button>
        </form>
      )}
    </div>
  );
}

export default UpdatePublication;
