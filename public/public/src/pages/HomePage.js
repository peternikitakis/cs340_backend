import React from 'react';

function HomePage() {

  const handleReset = async () => {
    try {
      const res = await fetch('http://localhost:3001/reset-db');
      const text = await res.text();
      alert(text || 'Database reset.');
    } catch (err) {
      console.error("Reset failed:", err);
      alert('Reset failed.');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:3001/delete-test');
      const text = await res.text();
      alert(text || 'Test student deleted.');
    } catch (err) {
      console.error("Delete failed:", err);
      alert('Delete failed.');
    }
  };

  return (
    <div> 
      <h1>OSU Event Registration Portal</h1>
      <p>Use links below to manage students, events, and more.</p>
      
      <ul>
        <li><a href="/students">Manage Students</a></li>
        <li><a href="/events">Manage Events</a></li>
        <li><a href="/organizations">Manage Organizations</a></li>
        <li><a href="/locations">Manage Locations</a></li>
        <li><a href="/registrations">Manage Registrations</a></li>
      </ul>

      <hr />

      <button onClick={handleReset}>RESET Database</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
        Delete Test Student
      </button>
    </div>
  );
}

export default HomePage;
