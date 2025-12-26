import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const ChairDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", priority: "Medium", deadline: "", assigned_to: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "EMPLOYEE", designation: "" });
  const [profileUpdate, setProfileUpdate] = useState({ name: "", designation: "", otp: "", newPassword: "" });
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState(null);
  
  const [step, setStep] = useState(1); 

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "C";

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const fetchData = async () => {
    try {
      const taskRes = await axios.get("http://localhost:8080/api/tasks/chair-tasks", { headers: { Authorization: `Bearer ${token}` } });
      setTasks(taskRes.data);
      const userRes = await axios.get("http://localhost:8080/api/auth/employees", { headers: { Authorization: `Bearer ${token}` } });
      setEmployees(userRes.data);
    } catch (err) { console.error("Sync Error", err); }
  };

  useEffect(() => {
    fetchData();
    socket.on("refresh_data", fetchData);
    return () => socket.off("refresh_data");
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' };
      case 'In Progress': return { color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24' };
      case 'Pending': return { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' };
      default: return { color: '#9ca3af', background: '#020617', border: '1px solid #374151' };
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/tasks/create", formData, { headers: { Authorization: `Bearer ${token}` } });
      socket.emit("task_action");
      setFormData({ title: "", description: "", priority: "Medium", deadline: "", assigned_to: "" });
      showNotification("🚀 Task Pushed Successfully!");
    } catch (err) { showNotification("❌ Assignment Failed", "error"); }
    finally { setIsLoading(false); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/users/register", newUser, { headers: { Authorization: `Bearer ${token}` } });
      setNewUser({ name: "", email: "", password: "", role: "EMPLOYEE", designation: "" });
      socket.emit("task_action");
      showNotification("👤 New Employee Registered!");
      fetchData();
    } catch (err) { 
        const errorMsg = err.response?.data?.error || "Registration Failed";
        showNotification(`❌ ${errorMsg}`, "error"); 
    }
    finally { setIsLoading(false); }
  };

  const handleFullUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put("http://localhost:8080/api/users/update-profile", 
        { name: profileUpdate.name, designation: profileUpdate.designation, otp: profileUpdate.otp, newPassword: profileUpdate.newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("✅ Account Updated Successfully!");
      setShowVerifyModal(false);
      setStep(1);
      fetchData();
    } catch (err) { 
        showNotification(`❌ ${err.response?.data?.message || "Update failed"}`, "error"); 
    }
    finally { setIsLoading(false); }
  };

  const requestOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/users/request-verification", {}, { headers: { Authorization: `Bearer ${token}` } });
      setStep(2);
      showNotification("📧 OTP sent! Check email or terminal.");
    } catch (err) { showNotification("❌ OTP Request Failed", "error"); }
    finally { setIsLoading(false); }
  };

  const triggerRevokeConfirm = (id) => {
    setTargetEmployeeId(id);
    setShowRevokeModal(true);
  };

  const confirmRevokeAction = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/users/remove/${targetEmployeeId}`, { headers: { Authorization: `Bearer ${token}` } });
      socket.emit("task_action");
      showNotification("👤 Employee Revoked Successfully!", "success");
      fetchData(); // This refreshes the list with the new 'is_active' status
      setShowRevokeModal(false);
    } catch (err) { showNotification("❌ Removal Failed", "error"); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '2rem' }}>
      {isLoading && (
        <div style={loaderOverlay}>
          <div className="spinner"></div>
          <style>{`.spinner { width: 50px; height: 50px; border: 5px solid #1f2937; border-top: 5px solid #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{ 
        ...toastStyle, 
        transform: toast.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-100px)', 
        background: toast.type === 'success' ? '#10b981' : toast.type === 'info' ? '#3b82f6' : '#ef4444' 
      }}>
        {toast.message}
      </div>

      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Chairperson Dashboard</h1>
          <p style={{ color: '#9ca3af' }}>System Pulse: <span style={{ color: '#10b981', animation: 'pulse 2s infinite' }}>● Active</span></p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div onClick={() => setShowProfile(!showProfile)} style={avatarStyle}>
            {userName[0].toUpperCase()}
          </div>
          {showProfile && (
            <div style={dropdownStyle}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#9ca3af' }}>{userName}</p>
              <button onClick={() => { setShowVerifyModal(true); setShowProfile(false); }} style={dropItem}>⚙️ Settings</button>
              <button onClick={() => { localStorage.clear(); window.location.href='/'; }} style={logoutBtn}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {showVerifyModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{marginBottom: '1rem'}}>Profile & Security</h3>
            <form onSubmit={handleFullUpdate}>
               <p style={labelStyle}>Basic Information</p>
               <input type="text" placeholder="Update Name" style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, name: e.target.value})} />
               <input type="text" placeholder="Update Designation" style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, designation: e.target.value})} />
               <hr style={{margin: '1rem 0', borderColor: '#1f2937'}} />
               <p style={labelStyle}>Security Reset</p>
               {step === 1 ? (
                 <button type="button" onClick={requestOTP} style={btnStyle}>Get OTP for Password Change</button>
               ) : (
                 <>
                   <input type="text" placeholder="6-Digit OTP" required style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, otp: e.target.value})} />
                   <input type="password" placeholder="New Password" required style={inputStyle} onChange={(e) => setProfileUpdate({...profileUpdate, newPassword: e.target.value})} />
                 </>
               )}
               <button type="submit" style={{...btnStyle, background: '#10b981', marginTop: '1rem'}}>Apply All Changes</button>
            </form>
            <button onClick={() => setShowVerifyModal(false)} style={{ background: 'none', border: 'none', color: '#ef4444', marginTop: '1rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {showRevokeModal && (
          <div style={modalOverlay}>
              <div style={{ ...modalContent, textAlign: 'center', border: '1px solid #ef4444' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                  <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Confirm Revocation</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      Are you sure? This employee will lose all system access immediately. This action is recorded in the audit logs.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => setShowRevokeModal(false)} style={{ ...btnStyle, background: '#1f2937' }}>Cancel</button>
                      <button onClick={confirmRevokeAction} style={{ ...btnStyle, background: '#ef4444' }}>Yes, Revoke</button>
                  </div>
              </div>
          </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={cardStyle}>
          <h3>Assign New Work</h3>
          <form onSubmit={handleAssign}>
            <input type="text" placeholder="Title" required style={inputStyle} onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} />
            <textarea placeholder="Description" required style={inputStyle} onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} />
            <select style={inputStyle} required onChange={(e) => setFormData({...formData, assigned_to: e.target.value})} value={formData.assigned_to}>
              <option value="">Select Employee</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
            <input type="datetime-local" required style={inputStyle} onChange={(e) => setFormData({...formData, deadline: e.target.value})} value={formData.deadline} />
            <button type="submit" style={btnStyle} disabled={isLoading}>Assign Task</button>
          </form>
        </div>

        <div style={cardStyle}>
          <h3>Add New Employee</h3>
          <form onSubmit={handleAddUser}>
            <input type="text" placeholder="Name" required style={inputStyle} onChange={(e) => setNewUser({...newUser, name: e.target.value})} value={newUser.name} />
            <input type="email" placeholder="Email" required style={inputStyle} onChange={(e) => setNewUser({...newUser, email: e.target.value})} value={newUser.email} />
            <input type="password" placeholder="Password" required style={inputStyle} onChange={(e) => setNewUser({...newUser, password: e.target.value})} value={newUser.password} />
            <input type="text" placeholder="Designation (e.g. Intern)" required style={inputStyle} onChange={(e) => setNewUser({...newUser, designation: e.target.value})} value={newUser.designation} />
            <button type="submit" style={{ ...btnStyle, background: '#10b981' }} disabled={isLoading}>Register User</button>
          </form>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: '2rem' }}>
        <h3>Live Monitoring & Offboarding</h3>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#9ca3af', textAlign: 'left', borderBottom: '1px solid #1f2937' }}>
              <th style={{ padding: '1rem 0' }}>Task</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #1f2937' }}>
                <td style={{ padding: '1rem 0' }}>{t.title}</td>
                <td>{t.employee_name}</td>
                <td>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                    ...getStatusStyle(t.status) 
                  }}>
                    {t.status}
                  </span>
                </td>
                <td>
                  {/* FIXED: We check is_active from the backend query */}
                  {t.is_active === 0 ? (
                    <button disabled style={{ ...removeBtnStyle, background: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', border: '1px solid #9ca3af', cursor: 'not-allowed' }}>Revoked</button>
                  ) : (
                    <button onClick={() => triggerRevokeConfirm(t.assigned_to)} style={removeBtnStyle} disabled={isLoading}>Revoke Access</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const avatarStyle = { width: '42px', height: '42px', background: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', border: '2px solid #1f2937' };
const dropdownStyle = { position: 'absolute', top: '50px', right: 0, background: '#0f172a', border: '1px solid #1f2937', padding: '0.8rem', borderRadius: '12px', width: '160px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' };
const dropItem = { width: '100%', background: 'none', border: 'none', color: 'white', padding: '0.6rem', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', fontSize: '0.9rem' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10002 };
const modalContent = { background: '#0f172a', padding: '1.5rem', borderRadius: '1.5rem', width: '340px', border: '1px solid #1f2937' };
const loaderOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 };
const toastStyle = { position: 'fixed', top: '20px', left: '50%', padding: '0.8rem 2rem', borderRadius: '50px', color: 'white', zIndex: 9999, fontWeight: 'bold', transition: '0.4s' };
const removeBtnStyle = { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' };
const logoutBtn = { width: '100%', background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' };
const cardStyle = { background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #1f2937' };
const inputStyle = { width: '100%', marginBottom: '0.8rem', padding: '0.7rem', background: '#020617', border: '1px solid #374151', color: 'white', borderRadius: '8px' };
const btnStyle = { width: '100%', background: '#8b5cf6', color: 'white', padding: '0.7rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const labelStyle = { fontSize: '0.75rem', color: '#9ca3af', textAlign: 'left', marginBottom: '5px' };

export default ChairDashboard;