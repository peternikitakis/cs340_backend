import React, { useState, useEffect } from "react";

function RegistrationsList() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    studentID: "",
    eventID: "",
    timestamp: "",
  });

  const [updateForm, setUpdateForm] = useState({
    registrationID: "",
    studentID: "",
    eventID: "",
  });

  const fetchData = async () => {
    try {
      const [regRes, stuRes, evtRes] = await Promise.all([
        fetch(`${API_BASE}/registrations`),
        fetch(`${API_BASE}/students`),
        fetch(`${API_BASE}/events`),
      ]);
      if (!regRes.ok || !stuRes.ok || !evtRes.ok) throw new Error("Failed to fetch data");

      const [regData, stuData, evtData] = await Promise.all([
        regRes.json(),
        stuRes.json(),
        evtRes.json(),
      ]);
      setData(regData);
      setStudents(stuData);
      setEvents(evtData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addRegistration = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/add-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Registration added.");
        setForm({ studentID: "", eventID: "", timestamp: "" });
        fetchData();
      } else {
        alert("Add failed.");
      }
    } catch (err) {
      console.error("Error adding registration:", err);
    }
  };

  const removeRegistration = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete-registration/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Registration deleted.");
        fetchData();
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Error deleting registration:", err);
    }
  };

  const updateRegistration = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/update-registration`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationID: Number(updateForm.registrationID),
          studentID: Number(updateForm.studentID),
          eventID: Number(updateForm.eventID),
        }),
      });
      if (res.ok) {
        alert("Registration updated.");
        setUpdateForm({ registrationID: "", studentID: "", eventID: "" });
        fetchData();
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Error updating registration:", err);
    }
  };

  return (
    <div>
      <h2>Registrations</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Student</th><th>Event</th><th>Time</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.registrationID}>
              <td>{r.registrationID}</td>
            <td>{(() => {
              const s = students.find((s) => s.studentID === r.studentID);
              return s ? `${s.firstName} ${s.lastName}` : "?";
            })()}</td>
              <td>{events.find((e) => e.eventID === r.eventID)?.title || "?"}</td>
              <td>{r.timestamp}</td>
              <td><button onClick={() => removeRegistration(r.registrationID)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Registration</h3>
      <form onSubmit={addRegistration}>
        <select
          value={form.studentID}
          onChange={(e) => setForm({ ...form, studentID: e.target.value })}
          required
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.studentID} value={s.studentID}>{s.firstName} {s.lastName}</option>
          ))}
        </select>

        <select
          value={form.eventID}
          onChange={(e) => setForm({ ...form, eventID: e.target.value })}
          required
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.eventID} value={e.eventID}>{e.title}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.timestamp}
          onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
          required
        />
        <button>Add</button>
      </form>

      <h3>Update Registration</h3>
      <form onSubmit={updateRegistration}>
        <select
          value={updateForm.registrationID}
          onChange={(e) => setUpdateForm({ ...updateForm, registrationID: e.target.value })}
          required
        >
          <option value="">Select Registration ID</option>
          {data.map((r) => (
            <option key={r.registrationID} value={r.registrationID}>{r.registrationID}</option>
          ))}
        </select>

        <select
          value={updateForm.studentID}
          onChange={(e) => setUpdateForm({ ...updateForm, studentID: e.target.value })}
          required
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.studentID} value={s.studentID}>{s.firstName} {s.lastName}</option>
          ))}
        </select>

        <select
          value={updateForm.eventID}
          onChange={(e) => setUpdateForm({ ...updateForm, eventID: e.target.value })}
          required
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.eventID} value={e.eventID}>{e.title}</option>
          ))}
        </select>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default RegistrationsList;
