import React, { useState } from 'react';
import { authAPI } from '../services/api';
import '../App.css'; // Stil üçün
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const response = await authAPI.forgotPassword({ email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
             <div className="login-form-section">
                <div className="login-card-wrapper" style={{maxWidth: '450px', margin: 'auto'}}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Şifrəni Bərpa Et</h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                        Email ünvanınızı daxil edin, şifrə bərpa linkini sizə göndərək.
                    </p>
                    {message && <div style={{ color: 'green', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>{message}</div>}
                    {error && <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
                    
                    {!message && (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label>Email Ünvanı</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading}
                            >
                                {loading ? 'Göndərilir...' : 'Bərpa Linki Göndər'}
                            </button>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                            Giriş səhifəsinə qayıt
                        </Link>
                    </div>
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

export default ForgotPassword; 