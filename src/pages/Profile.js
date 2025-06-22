import React, { useState, useEffect, useCallback } from "react";
import "./Profile.css";
import { useAuth } from "../services/AuthContext";
import { usersAPI } from "../services/api";

const ProfileDisplayCard = ({ user }) => (
  <div className="profile-display-card va-card">
    <div className="profile-avatar-lg">{(user?.profile?.firstName || user?.username || 'U').charAt(0).toUpperCase()}</div>
    <h2 className="profile-name">{user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : user?.username || "Loading..."}</h2>
    <p className="profile-role">{user?.role || "User"}</p>
    <div className="profile-info-list">
      <div className="profile-info-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
        <span>{user?.email || "..."}</span>
      </div>
       <div className="profile-info-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path></svg>
        <span>Qoşulma tarixi: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "..."}</span>
      </div>
    </div>
  </div>
);

const EditProfileForm = ({ user, onSave, setMsg }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    group: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        group: user.group || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      setMsg("Məlumatlar uğurla yeniləndi!");
    } catch (err) {
      setMsg("Xəta baş verdi: " + (err.response?.data?.message || err.message));
    } finally {
      setTimeout(() => setMsg(""), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="va-form-group">
        <label htmlFor="firstName">Ad</label>
        <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
      </div>
       <div className="va-form-group">
        <label htmlFor="lastName">Soyad</label>
        <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
      </div>
      <div className="va-form-group">
        <label htmlFor="group">Qrup</label>
        <input id="group" name="group" value={formData.group} onChange={handleChange} />
      </div>
      <div className="va-form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <button type="submit" className="va-button">Dəyişiklikləri Yadda Saxla</button>
    </form>
  );
};

const PasswordInput = ({ name, label, value, onChange, disabled, isValid, showValidation }) => {
    const [visible, setVisible] = useState(false);
    
    const getInputClassName = () => {
        if (!showValidation) return '';
        return isValid ? 'valid-input' : 'invalid-input';
    };
    
    return (
        <div className="va-form-group">
            <label htmlFor={name}>{label}</label>
            <div className="password-input-wrapper">
                <input 
                    id={name} 
                    name={name} 
                    type={visible ? "text" : "password"} 
                    value={value} 
                    onChange={onChange} 
                    required 
                    disabled={disabled}
                    className={getInputClassName()}
                />
                <span className="password-toggle-icon" onClick={() => setVisible(v => !v)}>
                    {visible ? '👁️' : '👁️‍🗨️'}
                </span>
            </div>
        </div>
    );
};

const ChangePasswordForm = ({ setMsg }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({
        current: { isValid: false, showValidation: false },
        new: { isValid: false, showValidation: false },
        confirm: { isValid: false, showValidation: false }
    });

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateConfirmPassword = (confirm, newPassword) => {
        return confirm === newPassword && confirm.length > 0;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setPasswords(p => ({ ...p, [name]: value }));
        
        // Real-time validation
        let isValid = false;
        if (name === 'current') {
            isValid = value.length > 0;
        } else if (name === 'new') {
            isValid = validatePassword(value);
        } else if (name === 'confirm') {
            isValid = validateConfirmPassword(value, passwords.new);
        }
        
        setValidation(prev => ({
            ...prev,
            [name]: { 
                isValid, 
                showValidation: value.length > 0 
            }
        }));
        
        // Update confirm validation when new password changes
        if (name === 'new') {
            setValidation(prev => ({
                ...prev,
                confirm: { 
                    isValid: validateConfirmPassword(passwords.confirm, value), 
                    showValidation: passwords.confirm.length > 0 
                }
            }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        if (passwords.new !== passwords.confirm) {
            setMsg("Yeni şifrələr eyni deyil.");
            setTimeout(() => setMsg(""), 4000);
            return;
        }

        if (passwords.new.length < 6) {
            setMsg("Yeni şifrə ən azı 6 simvol olmalıdır.");
            setTimeout(() => setMsg(""), 4000);
            return;
        }
        
        setLoading(true);
        try {
            const res = await usersAPI.changePassword(passwords.current, passwords.new);
            setMsg(res.data.message || "Şifrə uğurla dəyişdirildi!");
            setPasswords({ current: '', new: '', confirm: '' });
            setValidation({
                current: { isValid: false, showValidation: false },
                new: { isValid: false, showValidation: false },
                confirm: { isValid: false, showValidation: false }
            });
        } catch (err) {
            setMsg("Xəta: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(""), 4000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PasswordInput 
                name="current" 
                label="Köhnə Şifrə" 
                value={passwords.current} 
                onChange={handleChange} 
                disabled={loading}
                isValid={validation.current.isValid}
                showValidation={validation.current.showValidation}
            />
            <PasswordInput 
                name="new" 
                label="Yeni Şifrə" 
                value={passwords.new} 
                onChange={handleChange} 
                disabled={loading}
                isValid={validation.new.isValid}
                showValidation={validation.new.showValidation}
            />
            <PasswordInput 
                name="confirm" 
                label="Yeni Şifrəni Təkrarla" 
                value={passwords.confirm} 
                onChange={handleChange} 
                disabled={loading}
                isValid={validation.confirm.isValid}
                showValidation={validation.confirm.showValidation}
            />
            
            <div className="password-requirements">
                <h4>Şifrə Tələbləri:</h4>
                <ul>
                    <li>Ən azı 6 simvol uzunluğunda olmalıdır</li>
                    <li>Böyük və kiçik hərflər daxil edə bilərsiniz</li>
                    <li>Rəqəmlər və xüsusi simvollar istifadə edə bilərsiniz</li>
                    <li>Şifrəniz təhlükəsiz olmalıdır</li>
                </ul>
            </div>
            
            <button type="submit" className="va-button" disabled={loading}>
                {loading ? 'Yenilənir...' : 'Şifrəni Yenilə'}
            </button>
        </form>
    );
};

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("edit");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getProfile();
      setUser(res.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setMsg("Profil məlumatları yüklənə bilmədi.");
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (updatedData) => {
    if (!user || !user.id) throw new Error("İstifadəçi müəyyən edilməyib.");
    
    const res = await usersAPI.update(user.id, updatedData);
    
    setUser(prevUser => ({ ...prevUser, ...res.data.data }));
  };

  if (loading) {
    return <div className="profile-container">Yüklənir...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-grid">
        <div className="profile-grid-left">
          <ProfileDisplayCard user={user} />
        </div>
        <div className="profile-grid-right">
          <div className="profile-settings-card va-card">
            <div className="profile-tabs">
              <button onClick={() => setActiveTab('edit')} className={activeTab === 'edit' ? 'active' : ''}>Profili Redaktə Et</button>
              <button onClick={() => setActiveTab('password')} className={activeTab === 'password' ? 'active' : ''}>Şifrəni Dəyiş</button>
            </div>
            <div className="profile-tab-content">
              {activeTab === 'edit' ? <EditProfileForm user={user} onSave={handleSave} setMsg={setMsg} /> : <ChangePasswordForm setMsg={setMsg} />}
               {msg && <div className={`profile-message ${msg.startsWith('Xəta') ? 'error' : ''}`}>{msg}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 