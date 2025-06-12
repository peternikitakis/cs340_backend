import React, { useState, useEffect } from "react";

function EventsList() {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [orgs, setOrgs] = useState([]);

  const [form, setForm] = useState({
    title: "",
    eventDate: "",
    locationID: "",
    hostOrgID: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const fetchData = async () => {
    try {
      const [eventRes, locRes, orgRes] = await Promise.all([
        fetch(`${apiUrl}/events`),
        fetch(`${apiUrl}/locations`),
        fetch(`${apiUrl}/organizations`),
      ]);

      const [eventData, locData, orgData] = await Promise.all([
        eventRes.json(),
        locRes.json(),
        orgRes.json(),
      ]);

      setData(eventData);
      setLocations(locData);
      setOrgs(orgData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/add-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Event added.");
        setForm({ title: "", eventDate: "", locationID: "", hostOrgID: "" });
        fetchData();
      } else {
        alert("Add failed.");
      }
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  const removeEvent = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/delete-event/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Event deleted.");
        fetchData();
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div>
      <h2>Events</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Date</th><th>Location</th><th>Org</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e.eventID}>
              <td>{e.eventID}</td>
              <td>{e.title}</td>
              <td>{e.eventDate}</td>
              <td>{locations.find((l) => l.locationID === e.locationID)?.locationName || "?"}</td>
              <td>{orgs.find((o) => o.orgID === e.hostOrgID)?.orgName || "?"}</td>
              <td><button onClick={() => removeEvent(e.eventID)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Event</h3>
      <form onSubmit={addEvent}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          required
        />
        <select
          value={form.locationID}
          onChange={(e) => setForm({ ...form, locationID: e.target.value })}
          required
        >
          <option value="">Location</option>
          {locations.map((l) => (
            <option key={l.locationID} value={l.locationID}>{l.locationName}</option>
          ))}
        </select>
        <select
          value={form.hostOrgID}
          onChange={(e) => setForm({ ...form, hostOrgID: e.target.value })}
          required
        >
          <option value="">Org</option>
          {orgs.map((o) => (
            <option key={o.orgID} value={o.orgID}>{o.orgName}</option>
          ))}
        </select>
        <button>Add</button>
      </form>

      <h3>Update Event — TBD</h3>
    </div>
  );
}

export default EventsList;
