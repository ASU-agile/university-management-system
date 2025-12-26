import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api/axiosInstance";

function StaffProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  // We use location.state.staff as initial data, but we'll fetch fresh data
  const initialStaff = location.state?.staff;

  const [staffProfile, setStaffProfile] = useState(initialStaff || null);
  const [officeHours, setOfficeHours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile Editable States
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  // Office Hours Form
  const [newHour, setNewHour] = useState({ day: "Monday", start_time: "", end_time: "", location: "" });

  const avatarInputRef = useRef(null);
  const certInputRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  // Check if current user is the owner of this profile
  const canEdit = currentUser?.id === staffProfile?.id;

  useEffect(() => {
    if (!initialStaff) {
      navigate("/staff-directory");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const staffId = initialStaff.id;

        // 1. Fetch Office Hours
        const hoursRes = await api.get(`/api/staff/${staffId}/office-hours`);
        setOfficeHours(hoursRes.data || []);

        // 2. Fetch Full Profile (Bio, Certs, Avatar)
        // We added GET /api/staff/:id in backend
        const profileRes = await api.get(`/api/staff/${staffId}`);
        if (profileRes.data) {
          setStaffProfile(profileRes.data);
          setBioInput(profileRes.data.bio || "");
        }

      } catch (err) {
        console.error("Failed to fetch staff data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialStaff, navigate]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // --- Office Hours Logic ---
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
      await api.post(`/api/staff/${staffProfile.id}/office-hours`, { hours: officeHours });
      alert("Office hours saved");
    } catch (err) {
      console.error("Failed to save office hours", err);
      alert("Failed to save office hours");
    }
  };

  // --- Bio Logic ---
  const saveBio = async () => {
    try {
      const res = await api.put(`/api/staff/${staffProfile.id}/profile`, { bio: bioInput });
      setStaffProfile(prev => ({ ...prev, bio: res.data.bio }));
      setIsEditingBio(false);
    } catch (err) {
      console.error("Failed to save bio", err);
      alert("Failed to save bio");
    }
  };

  // --- Avatar Logic ---
  const handleAvatarClick = () => {
    if (canEdit && avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingAvatar(true);
    try {
      const res = await api.post(`/api/staff/${staffProfile.id}/upload-avatar`, formData, {
         headers: { "Content-Type": "multipart/form-data" }
      });
      setStaffProfile(prev => ({ ...prev, profile_picture_url: res.data.url }));
    } catch (err) {
      console.error("Avatar upload failed", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // --- Certificate Logic ---
  const handleCertUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingCert(true);
    try {
      // 1. Upload file
      const uploadRes = await api.post(`/api/staff/${staffProfile.id}/upload-certificate`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // 2. Add to local list and save to DB (certificates array in JSONB)
      const newCert = { name: uploadRes.data.name, url: uploadRes.data.url };
      const updatedCerts = [...(staffProfile.certificates || []), newCert];

      // Update backend with new array
      await api.put(`/api/staff/${staffProfile.id}/profile`, { certificates: updatedCerts });

      setStaffProfile(prev => ({ ...prev, certificates: updatedCerts }));
    } catch (err) {
      console.error("Certificate upload failed", err);
      alert("Failed to upload certificate");
    } finally {
      setUploadingCert(false);
    }
  };

  const removeCert = async (index) => {
    if (!confirm("Are you sure you want to remove this certificate?")) return;
    try {
      const updatedCerts = staffProfile.certificates.filter((_, i) => i !== index);
      // Update backend
      await api.put(`/api/staff/${staffProfile.id}/profile`, { certificates: updatedCerts });
      setStaffProfile(prev => ({ ...prev, certificates: updatedCerts }));
    } catch (err) {
      console.error("Failed to remove certificate", err);
      alert("Failed to remove certificate");
    }
  };

  if (!staffProfile) return null;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          
          <button 
            onClick={() => navigate("/staff-directory")}
            style={{ marginBottom: "20px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px", padding: 0 }}
          >
            ← Back to Staff Directory
          </button>

          {/* === PROFILE HEADER === */}
          <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "40px" }}>
            <div 
               style={{ position: "relative", width: "120px", height: "120px", cursor: canEdit ? "pointer" : "default" }}
               onClick={handleAvatarClick}
               title={canEdit ? "Click to change photo" : ""}
            >
              {staffProfile.profile_picture_url ? (
                <img 
                  src={staffProfile.profile_picture_url} 
                  alt="Profile" 
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #f8f9fa" }} 
                />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "#adb5bd" }}>
                   👤
                </div>
              )}
              {canEdit && (
                <div style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "#007bff", color: "white", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", border: "2px solid white" }}>
                   📷
                </div>
              )}
              <input type="file" ref={avatarInputRef} style={{ display: "none" }} accept="image/*" onChange={handleAvatarChange} />
              {uploadingAvatar && <div style={{position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px"}}>Uploading...</div>}
            </div>

            <div>
               <h1 style={{ margin: "0 0 5px 0", fontSize: "28px" }}>{staffProfile.name || "Unknown Staff"}</h1>
               <p style={{ margin: "0 0 10px 0", color: "#6c757d", fontSize: "16px" }}>{staffProfile.role || "Staff"}</p>
               <p style={{ margin: "0", color: "#007bff" }}>{staffProfile.email}</p>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "30px 0" }} />

          {/* === BIO SECTION === */}
          <section style={{ marginBottom: "40px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "20px" }}>About</h3>
                {canEdit && !isEditingBio && (
                  <button onClick={() => setIsEditingBio(true)} style={btnGeneric}>Edit Bio</button>
                )}
             </div>
             
             {isEditingBio ? (
               <div>
                  <textarea 
                    value={bioInput} 
                    onChange={(e) => setBioInput(e.target.value)}
                    style={{ width: "100%", minHeight: "150px", padding: "10px", borderRadius: "5px", border: "1px solid #ced4da", fontFamily: "inherit", resize: "vertical" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={saveBio} style={btnPrimary}>Save</button>
                    <button onClick={() => { setIsEditingBio(false); setBioInput(staffProfile.bio || ""); }} style={btnSecondary}>Cancel</button>
                  </div>
               </div>
             ) : (
               <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#333" }}>
                  {staffProfile.bio || "No biography provided."}
               </p>
             )}
          </section>

          {/* === CERTIFICATES SECTION === */}
          <section style={{ marginBottom: "40px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "20px" }}>Certifications</h3>
                {canEdit && (
                  <div>
                    <button onClick={() => certInputRef.current.click()} style={btnGeneric}>+ Add Certificate</button>
                    <input type="file" ref={certInputRef} style={{ display: "none" }} onChange={handleCertUpload} />
                  </div>
                )}
             </div>

             {uploadingCert && <p style={{ fontSize: "14px", color: "gray" }}>Uploading certificate...</p>}

             {staffProfile.certificates && staffProfile.certificates.length > 0 ? (
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                  {staffProfile.certificates.map((cert, idx) => (
                    <div key={idx} style={{ padding: "15px", border: "1px solid #e9ecef", borderRadius: "8px", position: "relative", backgroundColor: "#f8f9fa" }}>
                       <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "600", color: "#495057", textDecoration: "none", display: "block", marginBottom: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cert.name}>
                         📄 {cert.name}
                       </a>
                       {canEdit && (
                         <button 
                           onClick={() => removeCert(idx)}
                           style={{ position: "absolute", top: "5px", right: "5px", border: "none", background: "none", color: "#dc3545", cursor: "pointer", fontSize: "16px" }}
                           title="Remove certificate"
                         >
                           ×
                         </button>
                       )}
                    </div>
                  ))}
               </div>
             ) : (
               <p style={{ color: "#6c757d", fontStyle: "italic" }}>No certifications listed.</p>
             )}
          </section>

          <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "30px 0" }} />

          {/* === OFFICE HOURS SECTION === */}
          <section style={{ marginBottom: "40px" }}>
             <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>Office Hours</h3>
             
             {loading ? <p>Loading...</p> : (
               <>
                 {officeHours.length === 0 ? <p style={{ color: "#6c757d" }}>No office hours currently set.</p> : (
                   <ul style={{ listStyle: "none", padding: 0 }}>
                     {officeHours.map((h, i) => (
                       <li key={i} style={{ padding: "10px", marginBottom: "8px", backgroundColor: "#f8f9fa", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                         <span><strong>{h.day}</strong>: {h.start_time} - {h.end_time} {h.location ? `(@ ${h.location})` : ""}</span>
                         {canEdit && (
                           <button onClick={() => removeHour(i)} style={{ border: "none", background: "none", color: "#dc3545", cursor: "pointer" }}>Remove</button>
                         )}
                       </li>
                     ))}
                   </ul>
                 )}

                 {canEdit && (
                   <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                     <h4 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Add New Office Hour</h4>
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                       <select value={newHour.day} onChange={(e) => setNewHour({ ...newHour, day: e.target.value })} style={inputStyle}>
                         {days.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                       <input placeholder="Location" value={newHour.location} onChange={(e) => setNewHour({ ...newHour, location: e.target.value })} style={inputStyle} />
                       <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px" }}>
                          <input type="time" value={newHour.start_time} onChange={(e) => setNewHour({ ...newHour, start_time: e.target.value })} style={inputStyle} />
                          <span>to</span>
                          <input type="time" value={newHour.end_time} onChange={(e) => setNewHour({ ...newHour, end_time: e.target.value })} style={inputStyle} />
                       </div>
                     </div>
                     <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={addHour} style={btnSecondary}>Add to List</button>
                        <button onClick={saveHours} style={btnPrimary}>Save Changes</button>
                     </div>
                   </div>
                 )}
               </>
             )}
          </section>

          {/* === ASSIGNED COURSES SECTION === */}
          <section>
            <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>Assigned Courses</h3>
            <AssignedCoursesBlock staff={staffProfile} canAdmin={currentUser?.role === 'admin'} />
          </section>

        </div>
      </main>
    </div>
  );
}

// Styles
const btnGeneric = {
  padding: "5px 10px", fontSize: "13px", cursor: "pointer", backgroundColor: "#e9ecef", border: "none", borderRadius: "4px", color: "#333"
};
const btnPrimary = {
  padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500"
};
const btnSecondary = {
  padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500"
};
const inputStyle = {
  padding: "8px", border: "1px solid #ced4da", borderRadius: "4px", width: "100%"
};


function AssignedCoursesBlock({ staff, canAdmin }) {
  const [allSubjects, setAllSubjects] = React.useState([]);
  const [assignedIds, setAssignedIds] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
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
        setError("Failed to load data: " + (err.message || "Unknown error"));
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
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ textAlign: "left" }}>
      {allSubjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #eee", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>
          {allSubjects.map((sub) => (
             canAdmin ? (
                <div key={sub.id} style={{ marginBottom: "6px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input type="checkbox" checked={assignedIds.has(sub.id)} onChange={() => toggle(sub.id)} />
                    <span><strong>{sub.subject_name}</strong> <small style={{ color: "#777" }}>({sub.subject_code})</small></span>
                  </label>
                </div>
             ) : (
                assignedIds.has(sub.id) && (
                   <div key={sub.id} style={{ padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <strong>{sub.subject_name}</strong> ({sub.subject_code})
                   </div>
                )
             )
          ))}
        </div>
      )}

      {canAdmin && (
        <div style={{ marginTop: "8px" }}>
          <button onClick={save} style={btnPrimary}>Save Assigned Courses</button>
        </div>
      )}

      {!canAdmin && Array.from(assignedIds).length === 0 && (
         <p style={{ color: "#777" }}>No assigned courses.</p>
      )}
    </div>
  );
}

export default StaffProfile;
