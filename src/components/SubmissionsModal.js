import React, { useState, useEffect } from 'react';
import { submissionsAPI } from '../services/api';
import './SubmissionsModal.css';

const SubmissionsModal = ({ taskId, taskTitle, onClose }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!taskId) return;
            try {
                setLoading(true);
                const res = await submissionsAPI.getByTaskId(taskId);
                setSubmissions(res.data.data || []);
            } catch (err) {
                setError('Nəticələri yükləmək mümkün olmadı.');
                setSubmissions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [taskId]);

    const formatDuration = (ms) => {
        if (ms === null || isNaN(ms)) return 'N/A';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} dəq ${seconds.toString().padStart(2, '0')} san`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Etibarsız tarix';
        }
        return date.toLocaleString('az-AZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content submission-modal">
                <div className="modal-header">
                    <h2>"{taskTitle}" üzrə iştirakçılar</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {loading && <p>Yüklənir...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && submissions && submissions.length === 0 && (
                        <p>Bu tapşırıq üçün heç bir nəticə tapılmadı.</p>
                    )}
                    {!loading && !error && submissions && submissions.length > 0 && (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Ad, Soyad</th>
                                    <th>Qrup</th>
                                    <th>Tarix</th>
                                    <th>Sərf olunan vaxt</th>
                                    {/* Add a column for viewing details if needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub.id}>
                                        <td>{sub.User ? `${sub.User?.profile?.firstName || ''} ${sub.User?.profile?.lastName || sub.User?.username}` : sub.guestInfo?.fullName || 'Qonaq'}</td>
                                        <td>{sub.User ? sub.User?.profile?.group : sub.guestInfo?.group || 'N/A'}</td>
                                        <td>{formatDate(sub.submittedAt)}</td>
                                        <td>{formatDuration(sub.duration)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmissionsModal; 