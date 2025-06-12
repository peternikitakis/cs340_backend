import React, { useState, useEffect } from "react";

function OrganizationsList() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    orgName: "",
    presidentEmail: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/organizations`);
      const orgs = await res.json();
      setData(orgs);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrg = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/add-organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Organization added.");
        setForm({ orgName: "", presidentEmail: "" });
        fetchData();
      } else {
        alert("Failed to add organization.");
      }
    } catch (err) {
      console.error("Error adding organization:", err);
    }
  };

  const removeOrg = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/delete-organization/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Organization deleted.");
        fetchData();
      } else {
        alert("Failed to delete organization.");
      }
    } catch (err) {
      console.error("Error deleting organization:", err);
    }
  };

  return (
    <div>
      <h2>Organizations</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o) => (
            <tr key={o.orgID}>
              <td>{o.orgID}</td>
              <td>{o.orgName}</td>
              <td>{o.presidentEmail}</td>
              <td><button onClick={() => removeOrg(o.orgID)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Organization</h3>
      <form onSubmit={addOrg}>
        <input
          placeholder="Name"
          value={form.orgName}
          onChange={(e) => setForm({ ...form, orgName: e.target.value })}
          required
        />
        <input
          placeholder="President Email"
          value={form.presidentEmail}
          onChange={(e) => setForm({ ...form, presidentEmail: e.target.value })}
          required
          type="email"
        />
        <button>Add</button>
      </form>

      <h3>Update Organization — TBD</h3>
    </div>
  );
}

export default OrganizationsList;
