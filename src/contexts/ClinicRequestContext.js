import React, { createContext, useContext } from 'react';
import api from '../api';

const ClinicRequestContext = createContext();

export const ClinicRequestProvider = ({ children }) => {

    // Méthode GET pour toutes les requêtes
    const getAllRequests = async () => {
        try {
            const res = await api.get('/clinic-requests');
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des requêtes :", error);
            throw error;
        }
    };
    // Méthode GET pour une seule requête
    const getRequestById = async (id) => {
        try {
            const res = await api.get(`/clinic-requests/${id}`);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de la requête :", error);
            throw error;
        }
    };

    // Méthode POST (ex: création)
    const createRequest = async (data) => {
        try {
            const res = await api.post('/clinic-requests', data);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la création :", error);
            throw error;
        }
    };

    // Méthode PUT (ex: mise à jour)
    const updateRequest = async (id, data) => {
        try {
            const res = await api.put(`/clinic-requests/${id}`, data);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            throw error;
        }
    };

    const deleteRequest = async (id) => {
        try {
            await api.delete(`/clinic-requests/${id}`);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            throw error;
        }
    };

    const checkPatientByNationality = async (nationalityId) => {
        try {
            const res = await api.get(`/patients/check/${nationalityId}`);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la vérification du patient :", error);
            throw error;
        }
    };

    const processPayment = async (id, paymentData) => {
        try {
            const res = await api.put(`/clinic-requests/${id}/payment`, paymentData);
            return res.data;
        } catch (error) {
            console.error("Erreur lors du paiement :", error);
            throw error;
        }
    };
    const uploadPDF = async (formData) => {
        try {
            const res = await api.post(`/uploads`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data; // assume it returns the file URL or path
        } catch (error) {
            console.error("Erreur lors de l'upload du PDF :", error);
            throw error;
        }
    };

    return (
        <ClinicRequestContext.Provider value={{ getRequestById, createRequest, updateRequest, getAllRequests, deleteRequest, checkPatientByNationality, processPayment, uploadPDF }}>
            {children}
        </ClinicRequestContext.Provider>
    );
};

// Hook personnalisé
export const useClinicRequest = () => useContext(ClinicRequestContext);
