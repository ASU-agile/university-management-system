import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api/axiosInstance";

function StudentProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Always get fresh user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [majors, setMajors] = useState([]);
  
  // Profile Editable States
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isEditingCareer, setIsEditingCareer] = useState(false);
  const [careerInput, setCareerInput] = useState(""); // major_id
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const avatarInputRef = useRef(null);
  
  // Check if we can edit (self-profile)
  const canEdit = profile && currentUser?.id === profile?.id;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!currentUser?.id) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch Majors first
        const majorsRes = await api.get("/auth/majors");
        setMajors(majorsRes.data);

        // Fetch Profile
        const res = await api.get(`/api/staff/${currentUser.id}`);
        if (res.data) {
          setProfile(res.data);
          setBioInput(res.data.bio || "");
          setCareerInput(res.data.major_id || ""); // Assume major_id comes back
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentUser?.id]);

  const saveProfileUpdate = async (updatedFields) => {
    try {
      const res = await api.put(`/api/staff/${profile.id}/profile`, updatedFields);
      setProfile(prev => ({ ...prev, ...res.data }));
      return true;
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
      return false;
    }
  };

  const saveBio = async () => {
    if (await saveProfileUpdate({ bio: bioInput })) {
      setIsEditingBio(false);
    }
  };

  const saveCareer = async () => {
    if (await saveProfileUpdate({ major_id: careerInput })) {
      setIsEditingCareer(false);
    }
  };

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
      const res = await api.post(`/api/staff/${profile.id}/upload-avatar`, formData, {
         headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, profile_picture_url: res.data.url }));
    } catch (err) {
      console.error("Avatar upload failed", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div style={{ padding: "40px", textAlign: "center" }}>Loading profile...</div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>{error || "Profile Not Found"}</h2>
            <p>Please ensure you are logged in correctly.</p>
            <button 
                onClick={() => navigate("/")} 
                style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
                Go to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          
          <button 
            onClick={() => navigate("/dashboard")}
            style={{ marginBottom: "20px", background: "none", border: "none", color: "#6c757d", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            ← Back to Dashboard
          </button>

          {/* === PROFILE HEADER === */}
          <div style={{ display: "flex", alignItems: "center", gap: "35px", marginBottom: "40px" }}>
            <div 
               style={{ position: "relative", width: "130px", height: "130px", cursor: canEdit ? "pointer" : "default" }}
               onClick={handleAvatarClick}
            >
              {profile.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url} 
                  alt="Profile" 
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #f8f9fa" }} 
                />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "50px", color: "#adb5bd" }}>
                   👤
                </div>
              )}
              {canEdit && (
                <div style={{ position: "absolute", bottom: "5px", right: "5px", backgroundColor: "#007bff", color: "white", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                   📷
                </div>
              )}
              <input type="file" ref={avatarInputRef} style={{ display: "none" }} accept="image/*" onChange={handleAvatarChange} />
              {uploadingAvatar && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600" }}>
                  Uploading...
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
               <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", color: "#1a1a1a" }}>{profile.name}</h1>
               <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                   {isEditingCareer ? (
                     <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        <select 
                          value={careerInput} 
                          onChange={(e) => setCareerInput(e.target.value)}
                          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                        >
                          <option value="">Select Career...</option>
                          {majors.map(m => <option key={m.id} value={m.id}>{m.major_name}</option>)}
                        </select>
                        <button onClick={saveCareer} style={{ ...btnPrimary, padding: "5px 10px", fontSize: "12px" }}>Save</button>
                        <button onClick={() => setIsEditingCareer(false)} style={{ ...btnSecondary, padding: "5px 10px", fontSize: "12px" }}>X</button>
                     </div>
                   ) : (
                     <>
                        <p style={{ margin: 0, color: "#007bff", fontSize: "18px", fontWeight: "600" }}>
                          Career: {profile.major || "Not Selected"}
                        </p>
                        {canEdit && (
                          <button 
                            onClick={() => setIsEditingCareer(true)} 
                            style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "12px", textDecoration: "underline", padding: 0 }}
                          >
                            Change
                          </button>
                        )}
                     </>
                   )}
                 </div>
                 <p style={{ margin: 0, color: "#6c757d", fontSize: "16px" }}>{profile.email}</p>
                 <span style={{ padding: "4px 12px", backgroundColor: "#e7f3ff", color: "#007bff", borderRadius: "20px", fontSize: "12px", fontWeight: "700", width: "fit-content", marginTop: "5px", textTransform: "uppercase" }}>
                    Student Account
                 </span>
               </div>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #f0f0f0", margin: "40px 0" }} />

          {/* === BIO SECTION === */}
          <section>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "22px", color: "#1a1a1a" }}>About</h3>
                {canEdit && !isEditingBio && (
                  <button onClick={() => setIsEditingBio(true)} style={btnSecondary}>Edit Bio</button>
                )}
             </div>
             
             {isEditingBio ? (
               <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <textarea 
                    value={bioInput} 
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Tell us about yourself..."
                    style={{ width: "100%", minHeight: "180px", padding: "15px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit", fontSize: "15px", lineHeight: "1.6", outline: "none", transition: "border-color 0.2s" }}
                  />
                  <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                    <button onClick={saveBio} style={btnPrimary}>Save Changes</button>
                    <button onClick={() => { setIsEditingBio(false); setBioInput(profile.bio || ""); }} style={{ ...btnSecondary, backgroundColor: "#fff", border: "1px solid #ddd" }}>Cancel</button>
                  </div>
               </div>
             ) : (
               <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px solid #f1f3f5" }}>
                 <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: "1.7", color: "#444", fontSize: "16px" }}>
                    {profile.bio || "No biography provided yet. Click edit to add one!"}
                 </p>
               </div>
             )}
          </section>

        </div>
      </main>
    </div>
  );
}

// Reusable Styles
const btnPrimary = {
  padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s"
};
const btnSecondary = {
  padding: "8px 16px", backgroundColor: "#f0f2f5", color: "#495057", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", transition: "all 0.2s"
};

export default StudentProfile;
