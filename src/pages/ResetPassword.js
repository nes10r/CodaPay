import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../App.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Şifrələr eyni deyil.');
            return;
        }
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const response = await authAPI.resetPassword(token, { password });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000); // 3 saniyə sonra giriş səhifəsinə yönləndir
        } catch (err) {
            setError(err.response?.data?.message || 'Xəta baş verdi. Token yanlış və ya vaxtı keçmiş ola bilər.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-section">
                <div className="login-card-wrapper" style={{maxWidth: '450px', margin: 'auto'}}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Yeni Şifrə Təyin Et</h2>
                    
                    {message && <div style={{ color: 'green', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>{message}</div>}
                    {error && <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
                    
                    {!message && (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label>Yeni Şifrə</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    disabled={loading}
                                />
                            </div>
                            <div className="input-group">
                                <label>Yeni Şifrəni Təsdiqlə</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading || password !== confirmPassword || password.length < 6}
                            >
                                {loading ? 'Yenilənir...' : 'Şifrəni Yenilə'}
                            </button>
                        </form>
                    )}
                     {message && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                                Giriş səhifəsinə keçid et
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="login-illustration">
                 <svg width="1800" height="1800" style={{ position: 'absolute', right: '-900px', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
                    <circle cx="900" cy="900" r="600" fill="#2196f3" fillOpacity="0.2" />
                    <circle cx="900" cy="900" r="440" fill="#2196f3" fillOpacity="0.4" />
                    <circle cx="900" cy="900" r="280" fill="#2196f3" fillOpacity="0.7" />
                </svg>
            </div>
        </div>
    );
};

export default ResetPassword; 