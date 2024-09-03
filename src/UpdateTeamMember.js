import React, { useState, useEffect } from 'react';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './UpdateTeamMember.css'; // Import the CSS file

function UpdateTeamMember() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/Team')
      .then(response => response.json())
      .then(data => setTeamMembers(data))
      .catch(error => console.error('Error fetching team members:', error));
  }, []);

  const handleSelectChange = (e) => {
    const memberId = e.target.value;
    const member = teamMembers.find(m => m._id === memberId);
    setSelectedMember(member);
    setName(member.name);
    setPosition(member.position);
    setType(member.type);
    setImageFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = selectedMember.image;

    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updatedMember = {
      name,
      position,
      type,
      image: imageUrl
    };

    try {
      const response = await fetch(`https://iot-backend-server-sparkling-sun-1719.fly.dev/updateTeamMember/${selectedMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMember),
      });

      if (response.ok) {
        alert('Team member updated successfully!');
        setSelectedMember(null); // Reset the form after successful update
      } else {
        const errorData = await response.json();
        alert(`Failed to update team member: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      alert('An error occurred while updating the team member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="update-team-member">
      <h3>Update Team Member</h3>
      <div>
        <label>Select a Team Member:</label>
        <select onChange={handleSelectChange} value={selectedMember ? selectedMember._id : ''}>
          <option value="" disabled>Select...</option>
          {teamMembers.map(member => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMember && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Position:</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
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
            <label>Image:</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              accept="image/*"
            />
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" width="100" />
            ) : (
              <img src={selectedMember.image} alt={selectedMember.name} width="100" />
            )}
          </div>
          <button type="submit" disabled={isSubmitting}>Update</button>
        </form>
      )}
    </div>
  );
}

export default UpdateTeamMember;
