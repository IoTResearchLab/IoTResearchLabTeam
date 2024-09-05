import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Firebase configuration
import { onAuthStateChanged } from "firebase/auth";
import { storage } from './firebase'; // Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './AddProject.css';

function AddProject() {
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState(''); // New field for project name
  const [introduction, setIntroduction] = useState('');
  const [type, setType] = useState('health'); // Dropdown for type selection
  const [paragraphs, setParagraphs] = useState([{ title: '', paragraph: '', img: null }]);
  const [slug, setSlug] = useState('');
  const [publications, setPublications] = useState([{ title: '', url: '', authors: '', date: '' }]); // Publications array
  const [imgSrc, setImgSrc] = useState(''); // To store the Firebase URL for the main image
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false); // For showing uploading status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Add a new publication
  const handleAddPublication = () => {
    setPublications([...publications, { title: '', url: '', authors: '', date: '' }]);
  };

  // Handle changes in publications
  const handlePublicationChange = (index, field, value) => {
    const newPublications = [...publications];
    newPublications[index][field] = value;
    setPublications(newPublications);
  };

  const handleRemovePublication = (index) => {
    const newPublications = [...publications];
    newPublications.splice(index, 1);
    setPublications(newPublications);
  };

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

  // Function to upload the main image to Firebase Storage
  const handleMainImageUpload = async (file) => {
    if (!file) return;

    const imageRef = ref(storage, `projects/${file.name}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);
    setImgSrc(imageUrl); // Set the image URL to be used in the form
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
    formData.append('projectName', projectName); // Include projectName in form data
    formData.append('introduction', introduction);
    formData.append('type', type); // Include the selected type in the submission
    formData.append('slug', slug);
    formData.append('imgSrc', imgSrc); // Add the Firebase image URL to the form

    // Add paragraphs data and images to FormData
    formData.append('paragraphs', JSON.stringify(paragraphs.map(p => ({
      title: p.title,
      paragraph: p.paragraph,
      img: p.img ? '' : p.img // We'll handle the image files separately
    }))));

    // Add publications data to FormData
    formData.append('publications', JSON.stringify(publications));

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
        setProjectName(''); // Reset projectName
        setIntroduction('');
        setType('health'); // Reset type to default
        setParagraphs([{ title: '', paragraph: '', img: null }]);
        setSlug('');
        setPublications([{ title: '', url: '', authors: '', date: '' }]);
        setImgSrc(''); // Reset imgSrc
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
          <label>Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="health">Health</option>
            <option value="smart mobility">Smart Mobility</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
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
          {publications.map((publication, index) => (
            <div key={index} className="publication-section">
              <input
                type="text"
                placeholder="Title"
                value={publication.title}
                onChange={(e) => handlePublicationChange(index, 'title', e.target.value)}
              />
              <input
                type="url"
                placeholder="URL"
                value={publication.url}
                onChange={(e) => handlePublicationChange(index, 'url', e.target.value)}
              />
              <input
                type="text"
                placeholder="Authors"
                value={publication.authors}
                onChange={(e) => handlePublicationChange(index, 'authors', e.target.value)}
              />
              <input
                type="date"
                value={publication.date}
                onChange={(e) => handlePublicationChange(index, 'date', e.target.value)}
              />
              <button type="button" onClick={() => handleRemovePublication(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddPublication}>Add Publication</button>
        </div>
        <div>
          <label>Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleMainImageUpload(e.target.files[0])}
          />
          {imgSrc && <img src={imgSrc} alt="Main project" width="100" />}
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
