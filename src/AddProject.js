import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Firebase configuration
import { onAuthStateChanged } from "firebase/auth";
import './AddProject.css';

function AddProject() {
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [paragraphs, setParagraphs] = useState([{ title: '', paragraph: '', img: null }]);
  const [slug, setSlug] = useState('');
  const [publications, setPublications] = useState('');
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false); // For showing uploading status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, { title: '', paragraph: '', img: null }]);
  };

  const handleParagraphChange = (index, field, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index][field] = value;
    setParagraphs(newParagraphs);
  };

  const handleFileChange = (index, file) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].img = file; // Store the image file in state
    setParagraphs(newParagraphs);
  };

  const handleRemoveParagraph = (index) => {
    const newParagraphs = [...paragraphs];
    newParagraphs.splice(index, 1);
    setParagraphs(newParagraphs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!user) {
      alert('You must be logged in to add a project.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('introduction', introduction);
    formData.append('slug', slug);
    formData.append('publications', publications);

    // Add paragraphs data and images to FormData
    formData.append('paragraphs', JSON.stringify(paragraphs.map(p => ({
      title: p.title,
      paragraph: p.paragraph,
      img: p.img ? '' : p.img // We'll handle the image files separately
    }))));

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.img) {
        formData.append('images', paragraph.img); // Send image file along with the form
      }
    });

    try {
      const response = await fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/addProject', {
        method: 'POST',
        body: formData, // Use FormData to send the data
      });

      if (response.ok) {
        alert('Project added successfully!');
        setTitle('');
        setIntroduction('');
        setParagraphs([{ title: '', paragraph: '', img: null }]);
        setSlug('');
        setPublications('');
      } else {
        alert('Failed to add project.');
      }
    } catch (error) {
      console.error('Error submitting the project:', error);
      alert('An error occurred while submitting the project.');
    } finally {
      setUploading(false);
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
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
              </div>
              <button type="button" onClick={() => handleRemoveParagraph(index)}>Remove Paragraph</button>
            </div>
          ))}
          <button type="button" onClick={handleAddParagraph}>Add Paragraph</button>
        </div>
        <button type="submit" disabled={uploading || !user}>
          {uploading ? 'Uploading...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
}

export default AddProject;
