import React, { useEffect, useState } from "react";

function StudentsList() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  const [data, setData] = useState([]);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (!res.ok) throw new Error("Failed to fetch");
      const students = await res.json();
      setData(students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (res.ok) {
        setNewStudent({ firstName: "", lastName: "", email: "" });
        fetchStudents();
      } else {
        alert("Failed to add student");
      }
    } catch (err) {
      console.error("Add student error:", err);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete-student/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchStudents();
      } else {
        alert("Failed to delete student");
      }
    } catch (err) {
      console.error("Delete student error:", err);
    }
  };

  return (
    <div>
      <h2>Students</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.studentID}>
              <td>{s.studentID}</td>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => deleteStudent(s.studentID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Student</h3>
      <form onSubmit={addStudent}>
        <input
          placeholder="First"
          value={newStudent.firstName}
          onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
          required
        />
        <input
          placeholder="Last"
          value={newStudent.lastName}
          onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          required
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default StudentsList;
