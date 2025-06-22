import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true,
        profile: {}
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await usersAPI.getAll();
            setUsers(res.data.data);
        } catch (err) {
            setError('İstifadəçiləri yükləmək mümkün olmadı.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditForm({
            username: user.username || '',
            email: user.email || '',
            password: '', // Şifrə sahəsi həmişə boş olsun
            role: user.role || 'user',
            isActive: user.isActive !== undefined ? user.isActive : true,
            profile: user.profile || {}
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const updateData = { ...editForm };
            
            // Şifrə boşdursa, onu göndərmə
            if (!updateData.password) {
                delete updateData.password;
            }

            await usersAPI.update(editingUser.id, updateData);
            
            // İstifadəçi siyahısını yenilə
            await fetchUsers();
            
            setShowEditModal(false);
            setEditingUser(null);
            setEditForm({
                username: '',
                email: '',
                password: '',
                role: 'user',
                isActive: true,
                profile: {}
            });
        } catch (err) {
            setError('İstifadəçi məlumatlarını yeniləmək mümkün olmadı.');
            console.error(err);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bu istifadəçini silmək istədiyinizə əminsinizmi?')) {
            try {
                await usersAPI.delete(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (err) {
                setError('İstifadəçini silmək mümkün olmadı.');
                console.error(err);
            }
        }
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProfileChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: value
            }
        }));
    };

    if (loading) return <div className="loading">Yüklənir...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <>
            <div className="admin-header">
                <h1>İstifadəçilərin İdarəedilməsi</h1>
                <p>Bütün istifadəçilərin məlumatlarını görə və redaktə edə bilərsiniz</p>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>İstifadəçi adı</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Status</th>
                            <th>Qeydiyyat tarixi</th>
                            <th>Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className={!user.isActive ? 'inactive-user' : ''}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                        {user.isActive ? 'Aktiv' : 'Deaktiv'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString('az-AZ')}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-button" 
                                            onClick={() => handleEdit(user)}
                                        >
                                            Redaktə et
                                        </button>
                                        <button 
                                            className="danger-button" 
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>İstifadəçi Məlumatlarını Redaktə Et</h2>
                            <button 
                                className="close-button" 
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>İstifadəçi adı:</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    placeholder="İstifadəçi adı"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Email ünvanı"
                                />
                            </div>

                            <div className="form-group">
                                <label>Yeni şifrə (boş buraxsanız dəyişməz):</label>
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Yeni şifrə (minimum 6 simvol)"
                                />
                            </div>

                            <div className="form-group">
                                <label>Rol:</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="company">Company</option>
                                    <option value="course">Course</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Status:</label>
                                <select
                                    value={editForm.isActive}
                                    onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                                >
                                    <option value={true}>Aktiv</option>
                                    <option value={false}>Deaktiv</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Ad:</label>
                                <input
                                    type="text"
                                    value={editForm.profile.firstName || ''}
                                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                    placeholder="Ad"
                                />
                            </div>

                            <div className="form-group">
                                <label>Soyad:</label>
                                <input
                                    type="text"
                                    value={editForm.profile.lastName || ''}
                                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                    placeholder="Soyad"
                                />
                            </div>

                            <div className="form-group">
                                <label>Qrup:</label>
                                <input
                                    type="text"
                                    value={editForm.profile.group || ''}
                                    onChange={(e) => handleProfileChange('group', e.target.value)}
                                    placeholder="Qrup"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="cancel-button" 
                                onClick={() => setShowEditModal(false)}
                            >
                                Ləğv et
                            </button>
                            <button 
                                className="save-button" 
                                onClick={handleSaveEdit}
                            >
                                Yadda saxla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminUsers; 