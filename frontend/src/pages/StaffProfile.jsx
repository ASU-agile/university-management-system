import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

function StaffProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const staff = location.state?.staff;

  const [officeHours, setOfficeHours] = useState([]);
  const [loadingHours, setLoadingHours] = useState(true);
  const [newHour, setNewHour] = useState({ day: "Monday", start_time: "", end_time: "", location: "" });

  if (!staff) {
    navigate("/staff-directory");
    return null;
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const canEdit = currentUser?.id === staff.id;

  useEffect(() => {
    const fetchHours = async () => {
      setLoadingHours(true);
      try {
        const res = await api.get(`/api/staff/${staff.id}/office-hours`);
        setOfficeHours(res.data || []);
      } catch (err) {
        console.error("Failed to fetch office hours", err);
      } finally {
        setLoadingHours(false);
      }
    };

    fetchHours();
  }, [staff.id]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; 

  const addHour = () => {
    if (!newHour.start_time || !newHour.end_time) {
      alert("Please provide start and end times");
      return;
    }
    setOfficeHours((s) => [...s, { ...newHour }]);
    setNewHour({ day: "Monday", start_time: "", end_time: "", location: "" });
  };

  const removeHour = (index) => {
    setOfficeHours((s) => s.filter((_, i) => i !== index));
  };

  const saveHours = async () => {
    try {
      await api.post(`/api/staff/${staff.id}/office-hours`, { hours: officeHours });
      alert("Office hours saved");
    } catch (err) {
      console.error("Failed to save office hours", err);
      alert("Failed to save office hours");
    }
  };

  const getRoleName = (staff) => {
    return staff.role || "Staff"; 
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <span
        onClick={() => navigate("/staff-directory")}
        style={{
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
          display: "inline-block",
          marginBottom: "20px"
        }}
      >
        ← Back to Staff Directory
      </span>

      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          fontSize: "50px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px"
        }}>👤</div>

        <h2>{staff.user_name || staff.name || "Unknown"}</h2>
        <p><strong>Email:</strong> {staff.user_email || staff.email}</p>
        <p><strong>Role:</strong> {getRoleName(staff)}</p>

        <hr style={{ margin: "20px 0" }} />

        <h3>Biography</h3>
        <p>
          This is a dummy biography for {staff.user_name || staff.name}. 
          Passionate about education, supporting students, and contributing to the academic community. Experienced in classroom management, mentoring, and fostering a positive learning environment.
        </p>

        <hr style={{ margin: "20px 0" }} />

        <h3>Office Hours</h3>

        {loadingHours ? (
          <p>Loading office hours...</p>
        ) : (officeHours.length === 0 ? (
          <p>No office hours set.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {officeHours.map((h, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                <strong>{h.day}</strong>: {h.start_time} - {h.end_time} {h.location ? `at ${h.location}` : ""}
                {canEdit && (
                  <button onClick={() => removeHour(i)} style={{ marginLeft: "10px" }}>Remove</button>
                )}
              </li>
            ))}
          </ul>
        ))}

        {canEdit && (
          <div style={{ marginTop: "16px", textAlign: "left" }}>
            <h4>Edit Office Hours</h4>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select value={newHour.day} onChange={(e) => setNewHour({ ...newHour, day: e.target.value })}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <input type="time" value={newHour.start_time} onChange={(e) => setNewHour({ ...newHour, start_time: e.target.value })} />
              <input type="time" value={newHour.end_time} onChange={(e) => setNewHour({ ...newHour, end_time: e.target.value })} />
              <input placeholder="Location (optional)" value={newHour.location} onChange={(e) => setNewHour({ ...newHour, location: e.target.value })} />
              <button onClick={addHour}>Add</button>
            </div>

            <div style={{ marginTop: "12px" }}>
              <button onClick={saveHours}>Save Office Hours</button>
            </div>
          </div>
        )}

        {/* ===== Assigned Courses (Admin edit / display) ===== */}
        <hr style={{ margin: "20px 0" }} />
        <h3>Assigned Courses</h3>

        <AssignedCoursesBlock staff={staff} canAdmin={JSON.parse(localStorage.getItem("user")||"{}")?.role === 'admin'} />

      </div>
    </div>
  );
}


function AssignedCoursesBlock({ staff, canAdmin }) {
  const [allSubjects, setAllSubjects] = React.useState([]);
  const [assignedIds, setAssignedIds] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subjectsRes, assignedRes] = await Promise.all([
          api.get("/api/subjects"),
          api.get(`/api/staff/${staff.id}/subjects`)
        ]);

        const subjects = Array.isArray(subjectsRes.data) ? subjectsRes.data : [];
        const assigned = Array.isArray(assignedRes.data) ? assignedRes.data : [];

        setAllSubjects(subjects);
        setAssignedIds(new Set(assigned.map(s => s.id)));
      } catch (err) {
        console.error("Failed to fetch subjects or assignments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staff.id]);

  const toggle = (id) => {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    try {
      await api.post(`/api/staff/${staff.id}/subjects`, { subject_ids: Array.from(assignedIds) });
      alert("Assigned courses saved");
    } catch (err) {
      console.error("Failed to save assignments", err);
      alert("Failed to save assignments");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div style={{ textAlign: "left" }}>
      {allSubjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #eee", padding: "8px" }}>
          {allSubjects.map((sub) => (
            <div key={sub.id} style={{ marginBottom: "6px" }}>
              <label>
                <input type="checkbox" checked={assignedIds.has(sub.id)} onChange={() => toggle(sub.id)} />
                &nbsp;<strong>{sub.subject_name}</strong> ({sub.subject_code})
              </label>
            </div>
          ))}
        </div>
      )}

      {canAdmin && (
        <div style={{ marginTop: "8px" }}>
          <button onClick={save}>Save Assigned Courses</button>
        </div>
      )}

      {/* For non-admin viewers, show assigned list read-only */}
      {!canAdmin && (
        <div style={{ marginTop: "8px" }}>
          {Array.from(assignedIds).length === 0 ? (
            <p>No assigned courses.</p>
          ) : (
            <ul>
              {Array.from(assignedIds).map((id) => {
                const sub = allSubjects.find(s => s.id === id) || { id, subject_name: `Course ${id}` };
                return <li key={id}>{sub.subject_name} ({sub.subject_code})</li>;
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default StaffProfile;
