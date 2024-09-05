import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Import Firebase configuration
import { onAuthStateChanged } from "firebase/auth";
import './UpdateProject.css'; // Import the CSS file

function UpdateProject() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [title, setTitle] = useState(''); // Optional
  const [projectName, setProjectName] = useState(''); // Required
  const [introduction, setIntroduction] = useState(''); // Optional
  const [paragraphs, setParagraphs] = useState([{ title: '', paragraph: '', img: '' }]); // Default values, not required
  const [slug, setSlug] = useState(''); // Required
  const [publications, setPublications] = useState([{ title: '', url: '', authors: '', date: '' }]); // Publications array
  const [type, setType] = useState(null); // Optional
  const [imgSrc, setImgSrc] = useState(''); // Required
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false); // Track upload state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleSelectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p._id === projectId);

    // Set the fields with the project data or default to empty strings
    setSelectedProject(project);
    setTitle(project?.title || ''); // Optional
    setProjectName(project?.projectName || ''); // Required
    setIntroduction(project?.introduction || ''); // Optional
    setParagraphs(
      project?.paragraphs?.map(p => ({
        title: p?.title || '', // Default to empty string if title is missing
        paragraph: p?.paragraph || '',
        img: p?.img || ''
      })) || [{ title: '', paragraph: '', img: '' }] // Default paragraph structure
    );
    setSlug(project?.slug || ''); // Required
    setPublications(Array.isArray(project?.publications) ? project.publications : [{ title: '', url: '', authors: '', date: '' }]);
    setType(project?.type ?? null); // Set type if it exists or is null
    setImgSrc(project?.imgSrc || ''); // Required
  };

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, { title: '', paragraph: '', img: '' }]); // Add a new empty paragraph
  };

  const handleParagraphChange = (index, field, value) => {
    const newParagraphs = paragraphs.slice();
    newParagraphs[index][field] = value || ''; // Default to empty string if no value provided
    setParagraphs(newParagraphs);
  };

  const handleFileChange = (index, file) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].img = file || ''; // Default to empty string if no file selected
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

    if (!user) {
      alert('You must be logged in to update a project.');
      return;
    }

    // Ensure required fields are filled
    if (!projectName || !slug || !imgSrc) {
      alert('Please fill in the required fields: Project Name, Slug, and Main Image.');
      return;
    }

    setUploading(true);

    // Ensure all fields default to empty strings if not filled
    const updatedProject = {
      projectName: projectName || '',
      title: title || '', // Optional field
      introduction: introduction || '', // Optional field
      slug: slug || '', // Required field
      imgSrc: imgSrc || '', // Required field
      publications: publications || '', // Optional field
      type: type, // Optional field
      paragraphs: paragraphs.map(p => ({
        title: p.title || '', // Optional field
        paragraph: p.paragraph || '', // Optional field
        img: typeof p.img === 'string' ? p.img : '' // Optional field, empty string if no image or not a string
      }))
    };

    const formData = new FormData();
    formData.append('projectName', updatedProject.projectName);
    formData.append('title', updatedProject.title);
    formData.append('introduction', updatedProject.introduction);
    formData.append('slug', updatedProject.slug);
    formData.append('imgSrc', updatedProject.imgSrc);
    formData.append('publications', JSON.stringify(updatedProject.publications));
    if (type !== null) {
      formData.append('type', updatedProject.type); // Append type only if present
    }
    formData.append('paragraphs', JSON.stringify(updatedProject.paragraphs));

    // Append any newly selected images (Files) to the form data
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.img instanceof File) {
        formData.append('images', paragraph.img); // Add the image file to the form data
      }
    });

    try {
      const response = await fetch(`https://iot-backend-server-sparkling-sun-1719.fly.dev/updateProject/${selectedProject._id}`, {
        method: 'PUT',
        body: formData, // Use FormData for both text and image files
      });

      if (response.ok) {
        alert('Project updated successfully!');
        setSelectedProject(null); // Reset the form after successful update
      } else {
        const errorData = await response.json();
        alert(`Failed to update project: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('An error occurred while updating the project.');
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
              onChange={(e) => setImgSrc(URL.createObjectURL(e.target.files[0]))}
              required
            />
            {/* Display a meaningful alt text or remove the alt attribute if it's decorative */}
            {imgSrc && <img src={imgSrc} width="300" alt={projectName ? projectName : 'Main project image'} />}
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
                  placeholder='Year of Publication'
                  value={publication.date}
                  onChange={(e) => handlePublicationChange(index, 'date', e.target.value)}
                />
                <button type="button" onClick={() => handleRemovePublication(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddPublication}>Add Publication</button>
          </div>

          {/* Conditionally render the type dropdown if the project has a type field or it's set to null */}
          {type !== undefined && (
            <div>
              <label>Type:</label>
              <select value={type || ''} onChange={(e) => setType(e.target.value)}>
                <option value="">Select a type</option>
                <option value="health">Health</option>
                <option value="smart mobility">Smart Mobility</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
          )}

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
                  {/* If img is a File, show the preview, otherwise show the URL from MongoDB */}
                  {paragraph.img instanceof File ? (
                    <img src={URL.createObjectURL(paragraph.img)} width="300" alt={paragraph.title ? paragraph.title : `Paragraph ${index + 1}`} />
                  ) : (
                    paragraph.img && <img src={paragraph.img} width="300" alt={paragraph.title ? paragraph.title : `Paragraph ${index + 1}`} />
                  )}
                </div>
                <button type="button" onClick={() => handleRemoveParagraph(index)}>Remove Paragraph</button>
              </div>
            ))}
            <button type="button" onClick={handleAddParagraph}>Add Paragraph</button>
          </div>
          <button type="submit" disabled={!user || uploading}>
            {uploading ? 'Updating...' : 'Update Project'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateProject;
