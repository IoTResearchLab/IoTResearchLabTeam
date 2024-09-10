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
  const [personalLink, setPersonalLink] = useState(''); // Add state for personalLink
  const [isSubmitting, setIsSubmitting] = useState(false);

  // List of team member types (including "None" as an option to send an empty string)
  const teamMemberTypes = ['Alumni', 'Affiliate Scholars', 'Intern', 'None'];

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
    setPersonalLink(member.personalLink || ''); // Load personalLink from selected member
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    let imageUrl = selectedMember.image;
  
    // Upload the image to Firebase if a new file is selected
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }
  
    // Check if personalLink is empty and handle accordingly
    const updatedMember = {
      name,
      position,
      type: type === 'None' ? '' : type, // If 'None' is selected, send an empty string
      image: imageUrl,
      personalLink: personalLink ? personalLink : "" // Ensure the personalLink is included, even if empty
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
        // Reload the team members list to reflect the updated data
        fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/Team')
          .then(response => response.json())
          .then(data => setTeamMembers(data));
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
  

  const handleDelete = async () => {
    if (!selectedMember) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedMember.name}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/deleteTeamMember', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedMember._id }),
      });

      if (response.ok) {
        alert('Team member deleted successfully!');
        // Remove the deleted member from the team list
        setTeamMembers(teamMembers.filter(member => member._id !== selectedMember._id));
        setSelectedMember(null); // Clear the form after deletion
      } else {
        alert('Failed to delete team member.');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('An error occurred while deleting the team member.');
    }
  };

  return (
    <div className="update-team-member">
      <h3>Update or Delete Team Member</h3>
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
        <>
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
              <label>Member info</label>
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
                {teamMemberTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'None' ? 'None' : type}
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
              />
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" width="100" />
              ) : (
                <img src={selectedMember.image} alt={selectedMember.name} width="100" />
              )}
            </div>
            <div>
              <label>Personal Link:</label> {/* New input for personalLink */}
              <input
                type="text"
                value={personalLink}
                onChange={(e) => setPersonalLink(e.target.value)}
                placeholder="Enter personal link"
              />
            </div>
            <button type="submit" disabled={isSubmitting}>Update Team Member</button>
          </form>

          <button
            onClick={handleDelete}
            style={{ 
              backgroundColor: 'red', 
              color: 'white', 
              width: '100%', // Set the width to 100% or any other value
              padding: '10px', // Add some padding for better appearance
              fontSize: '16px'  // Increase the font size if needed
            }}>
            Delete Team Member
          </button>
        </>
      )}
    </div>
  );
}

export default UpdateTeamMember;
