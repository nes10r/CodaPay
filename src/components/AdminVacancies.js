import React, { useState, useEffect, useCallback } from 'react';
import { vacanciesAPI } from '../services/api';
import VacancyForm from './VacancyForm';
import './AdminUsers.css'; // We can reuse styles for now

const AdminVacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState(null);

    const fetchVacancies = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await vacanciesAPI.getAll();
            setVacancies(res.data.data || []);
            setError(null);
        } catch (err) {
            setError('Vakansiyaları yükləmək mümkün olmadı.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVacancies();
    }, [fetchVacancies]);

    const handleOpenModal = (vacancy = null) => {
        setSelectedVacancy(vacancy);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVacancy(null);
    };

    const handleSave = () => {
        handleCloseModal();
        fetchVacancies(); // Refresh the list after save
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu vakansiyanı silməyə əminsiniz?')) {
            try {
                await vacanciesAPI.delete(id);
                fetchVacancies(); // Refresh list
            } catch (err) {
                setError('Vakansiyanı silmək mümkün olmadı.');
                console.error(err);
            }
        }
    };

    if (isLoading) return <div>Yüklənir...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-users-container">
            <h2>Vakansiyaların İdarə Edilməsi</h2>
            <button onClick={() => handleOpenModal()} className="add-user-button">
                Yeni Vakansiya Yarat
            </button>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Başlıq</th>
                        <th>Status</th>
                        <th>Yaradılma Tarixi</th>
                        <th>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {vacancies.length > 0 ? (
                        vacancies.map(vacancy => (
                            <tr key={vacancy.id}>
                                <td>{vacancy.title}</td>
                                <td>{vacancy.isActive ? 'Aktiv' : 'Passiv'}</td>
                                <td>{new Date(vacancy.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleOpenModal(vacancy)} className="edit-button">Redaktə</button>
                                    <button onClick={() => handleDelete(vacancy.id)} className="delete-button">Sil</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Heç bir vakansiya tapılmadı.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {isModalOpen && (
                <VacancyForm
                    vacancy={selectedVacancy}
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AdminVacancies; 