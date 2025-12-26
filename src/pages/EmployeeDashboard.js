import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8080");

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRevoked, setIsRevoked] = useState(false); 
  const [actionLoading, setActionLoading] = useState(false); 
  
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [showProfile, setShowProfile] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  const [profileUpdate, setProfileUpdate] = useState({ name: "", designation: "", otp: "", newPassword: "" });
  const [step, setStep] = useState(1); 

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "E";

  const showNotification = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tasks/my-tasks", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setTasks(res.data);
      setLoading(false);
    } catch (err) { 
      // Catching the 403 status to trigger the Blocked UI
      if (err.response && err.response.status === 403) {
          setIsRevoked(true);
      }
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
    socket.on("refresh_data", fetchTasks);
    return () => socket.off("refresh_data");
  }, [token]);

  const handleStatusChange = async (taskId, newStatus) => {
    setActionLoading(true);
    try {
      await axios.put("http://localhost:8080/api/tasks/update-status", 
        { taskId, status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(t => Number(t.id) === Number(taskId) ? { ...t, status: newStatus } : t));
      socket.emit("task_action"); 
      const notifyType = newStatus === 'In Progress' ? 'warning' : newStatus === 'Completed' ? 'success' : 'info';
      showNotification(`✅ Progress updated to: ${newStatus}`, notifyType);
    } catch (err) { 
      showNotification("❌ Update failed", "error"); 
    } finally { setActionLoading(false); }
  };

  const handleFullUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await axios.put("http://localhost:8080/api/users/update-profile", 
        { name: profileUpdate.name, designation: profileUpdate.designation, otp: profileUpdate.otp, newPassword: profileUpdate.newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("✅ Profile Updated Successfully!", "success");
      setShowVerifyModal(false);
      setStep(1); 
    } catch (err) { 
        showNotification(`❌ ${err.response?.data?.message || "Update failed"}`, "error"); 
    }
    finally { setActionLoading(false); }
  };

  const requestOTP = async () => {
    setActionLoading(true);
    try {
      await axios.post("http://localhost:8080/api/users/request-verification", {}, { headers: { Authorization: `Bearer ${token}` } });
      setStep(2); // Revealing the hidden input fields
      showNotification("📧 OTP sent! Check email or terminal.", "success");
    } catch (err) { showNotification("❌ OTP Request Failed", "error"); }
    finally { setActionLoading(false); }
  };

  const formatDeadline = (dateString) => {
    if(!dateString) return "No Deadline Set";
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' };
      case 'In Progress': return { color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24' };
      case 'Pending': return { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' };
      default: return { color: '#9ca3af', background: '#020617', border: '1px solid #374151' };
    }
  };

  if (isRevoked) return (
      <div style={centerStyle}>
          <div style={{...modalContent, border: '1px solid #ef4444', width: '400px'}}>
              <h1 style={{color: '#ef4444', fontSize: '3rem'}}>🚫</h1>
              <h2 style={{color: 'white'}}>Account Inactive</h2>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>Your access has been <strong>Revoked</strong> by the Chairperson. You can no longer access system tasks.</p>
              <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={{...btnStyle, background: '#ef4444', marginTop: '1.5rem'}}>Back to Login</button>
          </div>
      </div>
  );

  if (loading) return <div style={centerStyle}><h2>Syncing Ausdauer...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e5e7eb', padding: '2rem' }}>
      
      {actionLoading && (
        <div style={loaderOverlay}>
          <div className="spinner"></div>
          <style>{`.spinner { width: 45px; height: 45px; border: 5px solid #1f2937; border-top: 5px solid #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* REFINED VIBRANT TOAST */}
      <div style={{ 
        ...toastStyle, 
        transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-150px)', 
        background: toast.type === 'success' ? '#10b981' : 
                    toast.type === 'warning' ? '#f59e0b' : 
                    toast.type === 'error' ? '#ef4444' : '#3b82f6' 
      }}>
        {toast.message}
      </div>

      <header style={headerStyle}>
        <div>
          <h2 style={{ margin: 0 }}>Employee Portal</h2>
          <p style={{ color: '#9ca3af', margin: '5px 0 0' }}>User: <strong style={{ color: '#8b5cf6' }}>{userName}</strong></p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div onClick={() => setShowProfile(!showProfile)} style={avatarStyle}>{userName[0].toUpperCase()}</div>
          {showProfile && (
            <div style={dropdownStyle}>
              <button onClick={() => { setShowVerifyModal(true); setShowProfile(false); }} style={dropItem}>⚙️ Settings</button>
              <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={{ ...dropItem, color: '#ef4444' }}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {showVerifyModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Account Settings</h3>
            <form onSubmit={handleFullUpdate}>
               <p style={labelStyle}>Basic Information</p>
               <input type="text" placeholder="Update Name" style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, name: e.target.value})} />
               <input type="text" placeholder="Update Designation" style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, designation: e.target.value})} />
               <hr style={{margin: '1.5rem 0', borderColor: '#1f2937'}} />
               
               {/* SECURITY FLOW WITH PROGRESSIVE DISCLOSURE */}
               <p style={labelStyle}>Security Reset</p>
               {step === 1 ? (
                 <button type="button" onClick={requestOTP} style={btnStyle} disabled={actionLoading}>
                   {actionLoading ? "Sending Code..." : "Get OTP for Password Change"}
                 </button>
               ) : (
                 <div style={{ animation: 'fadeIn 0.4s ease' }}>
                   <input type="text" placeholder="6-Digit OTP" required style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, otp: e.target.value})} />
                   <input type="password" placeholder="New Password" required style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, newPassword: e.target.value})} />
                   <p style={{ fontSize: '0.7rem', color: '#fbbf24', textAlign: 'left', marginTop: '-5px', marginBottom: '10px' }}>
                     * Enter the code sent to your terminal/email.
                   </p>
                 </div>
               )}
               
               <button type="submit" style={{...btnStyle, background: '#10b981', marginTop: '1.5rem'}} disabled={actionLoading}>
                 {actionLoading ? "Processing..." : "Apply All Changes"}
               </button>
            </form>
            <button onClick={() => { setShowVerifyModal(false); setStep(1); }} style={{ background: 'none', border: 'none', color: '#9ca3af', marginTop: '1rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {tasks.length === 0 ? <p style={{textAlign:'center', color:'#9ca3af'}}>No tasks assigned yet.</p> : tasks.map(task => (
          <div key={task.id} style={{ ...taskCard, borderLeft: `5px solid ${getStatusStyle(task.status).color}` }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.5rem' }}>{task.title}</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '10px' }}>{task.description}</p>
              <span style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.85rem' }}>⏳ Due: {formatDeadline(task.deadline)}</span>
            </div>
            <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)} style={{ ...selectStyle, ...getStatusStyle(task.status) }}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

// STYLES
const labelStyle = { fontSize: '0.75rem', color: '#9ca3af', textAlign: 'left', marginBottom: '5px' };
const avatarStyle = { width: '45px', height: '45px', background: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', border: '2px solid #374151' };
const dropdownStyle = { position: 'absolute', top: '55px', right: 0, background: '#0f172a', border: '1px solid #1f2937', padding: '0.5rem', borderRadius: '10px', width: '150px', zIndex: 100 };
const dropItem = { width: '100%', background: 'none', border: 'none', color: 'white', padding: '0.7rem', textAlign: 'left', cursor: 'pointer', borderRadius: '5px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10002 };
const modalContent = { background: '#0f172a', padding: '2rem', borderRadius: '1.5rem', width: '380px', border: '1px solid #1f2937', textAlign: 'center' };
const inputStyle = { width: '100%', marginBottom: '1rem', padding: '0.7rem', background: '#020617', border: '1px solid #374151', color: 'white', borderRadius: '8px' };
const btnStyle = { width: '100%', background: '#8b5cf6', color: 'white', padding: '0.8rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const loaderOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 };
const toastStyle = { position: 'fixed', top: '25px', left: '50%', padding: '1rem 2.5rem', borderRadius: '12px', color: 'white', zIndex: 99999, fontWeight: 'bold', transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '1rem', marginBottom: '2rem', alignItems: 'center' };
const taskCard = { background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1f2937' };
const selectStyle = { padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', outline: 'none' };
const centerStyle = { minHeight: '100vh', background: '#020617', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

export default EmployeeDashboard;