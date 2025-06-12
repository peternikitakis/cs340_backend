import React, { useState, useEffect } from "react";

function LocationsList() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ locationName: "" });

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/locations`);
      const locations = await res.json();
      setData(locations);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addLocation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/add-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Location added.");
        setForm({ locationName: "" });
        fetchData();
      } else {
        alert("Failed to add location.");
      }
    } catch (err) {
      console.error("Error adding location:", err);
    }
  };

  const removeLocation = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete-location/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Location deleted.");
        fetchData();
      } else {
        alert("Failed to delete location.");
      }
    } catch (err) {
      console.error("Error deleting location:", err);
    }
  };

  return (
    <div>
      <h2>Locations</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((l) => (
            <tr key={l.locationID}>
              <td>{l.locationID}</td>
              <td>{l.locationName}</td>
              <td><button onClick={() => removeLocation(l.locationID)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Location</h3>
      <form onSubmit={addLocation}>
        <input
          placeholder="Location Name"
          value={form.locationName}
          onChange={(e) => setForm({ ...form, locationName: e.target.value })}
          required
        />
        <button>Add</button>
      </form>

      <h3>Update Location — TBD</h3>
    </div>
  );
}

export default LocationsList;
