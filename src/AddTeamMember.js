import React, { useState } from 'react';
import { storage } from './firebase'; // Firebase storage for file uploads
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './AddTeamMember.css'

function AddTeamMember() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // To disable button while submitting

  // Define the available types for the dropdown
  const teamMemberTypes = ['Alumni', 'Affiliate Scholars', 'Intern'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button while submitting

    let imageUrl = '';

    // Upload the image to Firebase Storage
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Construct the team member data
    const teamMember = {
      name,
      position,
      type,
      image: imageUrl
    };

    // Submit the data to your backend API
    try {
      const response = await fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/addTeamMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMember),
      });

      if (response.ok) {
        alert('Team member added successfully!');
        setName('');
        setPosition('');
        setType('');
        setImageFile(null);
      } else {
        alert('Failed to add team member.');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('An error occurred while adding the team member.');
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <div className="add-teammember-container">
      <form onSubmit={handleSubmit}>
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
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Select type</option>
            {teamMemberTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Add Team Member'}
        </button>
      </form>
    </div>
  );
}

export default AddTeamMember;
