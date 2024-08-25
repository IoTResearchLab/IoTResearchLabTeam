import React, { useState, useEffect } from 'react';
import { auth, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

function AddTeamMember() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [user, setUser] = useState(null);

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

    const response = await fetch('https://team-website-backend.fly.dev/addTeamMember', {
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
          required
        />
      </div>
      <button type="submit" disabled={!user}>Add Team Member</button>
    </form>
  );
}

export default AddTeamMember;
