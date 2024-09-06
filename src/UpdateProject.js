import React, { useState, useEffect } from 'react';
import './UpdateProject.css'; // Import the CSS file
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function UpdateProject() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [paragraphs, setParagraphs] = useState([{ title: '', paragraph: '', img: '' }]);
  const [slug, setSlug] = useState('');
  const [publications, setPublications] = useState([{ title: '', url: '', authors: '', date: '' }]);
  const [type, setType] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  // Helper function to upload images to Firebase and return the download URL
  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    
    const storage = getStorage();  // Initialize Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);  // Create a reference with a unique name
    
    try {
      await uploadBytes(storageRef, file);  // Upload the image
      const downloadURL = await getDownloadURL(storageRef);  // Get the URL of the uploaded image
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  const handleSelectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p._id === projectId);

    setSelectedProject(project);
    setTitle(project?.title || '');
    setProjectName(project?.projectName || '');
    setIntroduction(project?.introduction || '');
    setParagraphs(
      project?.paragraphs?.map(p => ({
        title: p?.title || '',
        paragraph: p?.paragraph || '',
        img: p?.img || ''
      })) || [{ title: '', paragraph: '', img: '' }]
    );
    setSlug(project?.slug || '');
    setPublications(Array.isArray(project?.publications) ? project.publications : [{ title: '', url: '', authors: '', date: '' }]);
    setType(project?.type ?? null);
    setImgSrc(project?.imgSrc || '');
  };

  const handleMainImageChange = async (file) => {
    if (file) {
      const downloadURL = await uploadImageToFirebase(file);
      if (downloadURL) setImgSrc(downloadURL);
    }
  };

  const handleFileChange = async (index, file) => {
    if (file) {
      const downloadURL = await uploadImageToFirebase(file);
      if (downloadURL) {
        const newParagraphs = [...paragraphs];
        newParagraphs[index].img = downloadURL;
        setParagraphs(newParagraphs);
      }
    }
  };

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, { title: '', paragraph: '', img: '' }]);
  };

  const handleParagraphChange = (index, field, value) => {
    const newParagraphs = paragraphs.slice();
    newParagraphs[index][field] = value || '';
    setParagraphs(newParagraphs);
  };

  const handleRemoveParagraph = (index) => {
    const newParagraphs = paragraphs.slice();
    newParagraphs.splice(index, 1);
    setParagraphs(newParagraphs);
  };

  const handleAddPublication = () => {
    setPublications([...publications, { title: '', url: '', authors: '', date: '' }]);
  };

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!projectName || !slug) {
      alert('Please fill in the required fields: Project Name and Slug.');
      return;
    }
    
    setUploading(true);
  
    // First, upload any images that are files in the paragraphs
    const updatedParagraphs = await Promise.all(paragraphs.map(async (paragraph) => {
      // If the img is a file, upload it to Firebase
      if (paragraph.img instanceof File) {
        const downloadURL = await uploadImageToFirebase(paragraph.img);
        return {
          ...paragraph,
          img: downloadURL || '', // Replace the img field with the download URL
        };
      }
      return paragraph; // If not a file, return the paragraph as is
    }));
  
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('title', title || ''); 
    formData.append('introduction', introduction || ''); 
    formData.append('slug', slug || ''); 
    
    // Append main image file if there is one (ensure it's treated as a file)
    if (imgSrc instanceof File) {
      const mainImageUrl = await uploadImageToFirebase(imgSrc); // Upload the main image
      formData.append('imgSrc', mainImageUrl || ''); 
    } else {
      formData.append('imgSrc', imgSrc || ''); // If it's a URL, append it as is
    }
  
    formData.append('publications', JSON.stringify(publications));
    if (type !== null) {
      formData.append('type', type);
    }
  
    // Append the updated paragraphs data with Firebase image URLs
    formData.append('paragraphs', JSON.stringify(updatedParagraphs));
  
    try {
      const response = await fetch(`https://iot-backend-server-sparkling-sun-1719.fly.dev/updateProject/${selectedProject._id}`, {
        method: 'PUT',
        body: formData, 
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to update project: ${errorText}`);
      }
  
      alert('Project updated successfully!');
      setSelectedProject(null); // Reset the form after successful update
  
    } catch (error) {
      console.error('Error updating project:', error);
      alert(`Error updating project: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="update-project-container">
      <h3>Update Project</h3>
      <div>
        <label>Select a Project:</label>
        <select onChange={handleSelectChange} value={selectedProject ? selectedProject._id : ''}>
          <option value="" disabled>Select...</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Project Name (Required):</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value || '')}
              required
            />
          </div>
          <div>
            <label>Slug (Required):</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value || '')}
              required
            />
          </div>
          <div>
            <label>Main Image (Required):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleMainImageChange(e.target.files[0])}
            />
            {imgSrc && <img src={imgSrc} width="300" alt={projectName} />}
          </div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value || '')}
            />
          </div>
          <div>
            <label>Introduction:</label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value || '')}
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
                  type="text"
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
                  type="text"
                  placeholder="Year of Publication"
                  value={publication.date}
                  onChange={(e) => handlePublicationChange(index, 'date', e.target.value)}
                />
                <button type="button" onClick={() => handleRemovePublication(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddPublication}>Add Publication</button>
          </div>

          <div>
            <label>Type:</label>
            <select value={type || ''} onChange={(e) => setType(e.target.value)}>
              <option value="">Select a type</option>
              <option value="health">Health</option>
              <option value="smart mobility">Smart Mobility</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
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
                    onChange={(e) => handleParagraphChange(index, 'title', e.target.value || '')}
                  />
                </div>
                <div>
                  <label>Paragraph:</label>
                  <textarea
                    value={paragraph.paragraph}
                    onChange={(e) => handleParagraphChange(index, 'paragraph', e.target.value || '')}
                  />
                </div>
                <div>
                  <label>Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                  />
                  {paragraph.img && (
                    <img
                      src={paragraph.img}
                      width="300"
                      alt={paragraph.title || `Paragraph ${index + 1}`}
                    />
                  )}
                </div>
                <button type="button" onClick={() => handleRemoveParagraph(index)}>Remove Paragraph</button>
              </div>
            ))}
            <button type="button" onClick={handleAddParagraph}>Add Paragraph</button>
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? 'Updating...' : 'Update Project'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateProject;
