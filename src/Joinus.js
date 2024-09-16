import React, { useEffect, useState } from 'react';
import './style.css'; // Ensure the CSS file is imported

const SubmissionPreview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('https://iot-backend-server-sparkling-sun-1719.fly.dev/get-submissions');
        const data = await response.json();
        setSubmissions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  return (
    <div className="submission-preview-container">
      <h2>Submitted Forms</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Resume</th>
              <th>Cover Letter</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.subject}</td>
                <td>{submission.message}</td>
                <td>
                  <a href={submission.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </td>
                <td>
                  <a href={submission.coverLetterUrl} target="_blank" rel="noopener noreferrer">
                    View Cover Letter
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionPreview;
