import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import './UpdateProject.css'; // Import the CSS file

function UpdateProject() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
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

  useEffect(() => {
    fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleSelectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p._id === projectId);
    setSelectedProject(project);
    setTitle(project.title);
    setIntroduction(project.introduction);
    setParagraphs(project.paragraphs);
    setSlug(project.slug);
    setPublications(project.publications);
  };

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to update a project.');
      return;
    }

    const updatedProject = {
      title,
      introduction,
      paragraphs,
      slug,
      publications
    };

    try {
      const response = await fetch(`https://iot-backend-server-sparkling-sun-1719.fly.dev/updateProject/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
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
          <button type="submit" disabled={!user}>Update Project</button>
        </form>
      )}
    </div>
  );
}

export default UpdateProject;
