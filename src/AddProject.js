import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import './AddProject.css';

function AddProject() {
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [paragraphs, setParagraphs] = useState([{ title: '', paragraph: '', img: '' }]);
  const [slug, setSlug] = useState('');
  const [publications, setPublications] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, { title: '', paragraph: '', img: '' }]);
  };

  const handleParagraphChange = (index, field, value) => {
    const newParagraphs = paragraphs.slice();
    newParagraphs[index][field] = value;
    setParagraphs(newParagraphs);
  };

  const handleRemoveParagraph = (index) => {
    const newParagraphs = paragraphs.slice();
    newParagraphs.splice(index, 1);
    setParagraphs(newParagraphs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to add a project.');
      return;
    }

    const project = {
      title,
      introduction,
      paragraphs,
      slug,
      publications
    };

    const response = await fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/addProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (response.ok) {
      alert('Project added successfully!');
      setTitle('');
      setIntroduction('');
      setParagraphs([{ title: '', paragraph: '', img: '' }]);
      setSlug('');
      setPublications('');
    } else {
      alert('Failed to add project.');
    }
  };

  return (
    <div className="add-project-container">
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
        <label>Introduction:</label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Slug:</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Publications:</label>
        <input
          type="text"
          value={publications}
          onChange={(e) => setPublications(e.target.value)}
        />
      </div>
      <div>
        <label>Paragraphs:</label>
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="paragraph-section">
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={paragraph.title}
                onChange={(e) => handleParagraphChange(index, 'title', e.target.value)}
              />
            </div>
            <div>
              <label>Paragraph:</label>
              <textarea
                value={paragraph.paragraph}
                onChange={(e) => handleParagraphChange(index, 'paragraph', e.target.value)}
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={paragraph.img}
                onChange={(e) => handleParagraphChange(index, 'img', e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleRemoveParagraph(index)}>Remove Paragraph</button>
          </div>
        ))}
        <button type="button" onClick={handleAddParagraph}>Add Paragraph</button>
      </div>
      <button type="submit" disabled={!user}>Add Project</button>
    </form>
    </div>
  );
}

export default AddProject;
