import React, { useState, useEffect } from 'react';
import { vacanciesAPI } from '../services/api';
import './TaskForm.css'; // Stil üçün TaskForm-un CSS'ini istifadə edirik

const VacancyForm = ({ vacancy, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        isActive: true,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (vacancy) {
            setFormData({
                title: vacancy.title || '',
                description: vacancy.description || '',
                requirements: vacancy.requirements || '',
                isActive: vacancy.isActive !== undefined ? vacancy.isActive : true,
            });
        }
    }, [vacancy]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            if (vacancy) {
                await vacanciesAPI.update(vacancy.id, formData);
                setSuccess('Vakansiya uğurla yeniləndi!');
            } else {
                await vacanciesAPI.create(formData);
                setSuccess('Vakansiya uğurla yaradıldı!');
            }
            setTimeout(() => {
                onSave(); // Close modal and refresh list
            }, 1500);
        } catch (err) {
            setError('Xəta baş verdi. Məlumatları yadda saxlamaq mümkün olmadı.');
            console.error(err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content task-form-modal">
                <h2>{vacancy ? 'Vakansiyanı Redaktə Et' : 'Yeni Vakansiya Yarat'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Başlıq</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Təsvir</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="requirements">Tələblər</label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group form-check">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label htmlFor="isActive" className="form-check-label">Aktivdir</label>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="form-actions">
                        <button type="submit" className="save-button">Yadda Saxla</button>
                        <button type="button" onClick={onCancel} className="cancel-button">Ləğv Et</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VacancyForm; 