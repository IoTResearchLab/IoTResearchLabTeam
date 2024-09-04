import React, { useState, useEffect } from 'react';
import { auth, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import './AddTeamMember.css'

function AddTeamMember() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [user, setUser] = useState(null);

  // Define the available types for the dropdown
  const teamMemberTypes = ['Alumni','Affiliate Scholars','Intern'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to add a team member.');
      return;
    }

    const imageRef = ref(storage, `images/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const teamMember = {
      name,
      position,
      type,
      image: imageUrl
    };

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
        <label>Member Info:</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Position:</label>
        
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
      <button type="submit" disabled={!user}>Add Team Member</button>
    </form>
    </div>
  );
}

export default AddTeamMember;
