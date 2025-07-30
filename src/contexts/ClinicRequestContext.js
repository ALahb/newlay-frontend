import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { updateClinicRequestStatus, uploadClinicRequestReport, createAwsCaseDetails, sendPushNotification } from '../api';
import { useUser } from './UserContext';
import { getUrlParams } from '../utils/urlParams';

const { userId, organizationId } = getUrlParams();
console.log(userId, organizationId);
const ClinicRequestContext = createContext();

export const ClinicRequestProvider = ({ children }) => {
    const { user } = useUser();

    const getAllRequests = async (filters = {}, page = 1, limit = 5) => {
        try {
            const params = new URLSearchParams();

            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.nationalityId) params.append('nationality_id', filters.nationalityId);
            if (filters.patientName) params.append('patient_name', filters.patientName);
            if (filters.clinic_receiver_name) params.append('clinic_receiver_name', filters.clinic_receiver_name);
            if (filters.clinic_provider_id) params.append('clinic_provider_id', filters.clinic_provider_id);
            if (filters.clinic_receiver_id) params.append('clinic_receiver_id', filters.clinic_receiver_id);
            if (filters.clinic_provider_name) params.append('clinic_provider_name', filters.clinic_provider_name);
            if (filters.status) params.append('status', filters.status);
            
            params.append('page', page);
            params.append('limit', limit);

            const res = await api.get(`/clinic-requests?${params.toString()}`);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des requêtes :", error);
            throw error;
        }
    };

    const getRequestById = async (id) => {
        try {
            const res = await api.get(`/clinic-requests/${id}`);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de la requête :", error);
            throw error;
        }
    };

    const getStats = async () => {
        try {
            const res = await api.get('/clinic-requests/stats');
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques :", error);
            throw error;
        }
    };
    const createRequest = async (data) => {
        try {
            const res = await api.post('/clinic-requests', data);
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la création :", error);
            throw error;
        }
    };

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
            return res.data;
        } catch (error) {
            console.error("Erreur lors de l'upload du PDF :", error);
            throw error;
        }
    };

    const sendOnlinePayment = async (id) => {
        try {
            const res = await api.post('/payment/send-payment', { clinicRequestId: id });
            return res.data;
        } catch (error) {
            console.error("Erreur lors de l'envoi du paiement en ligne :", error);
            throw error;
        }
    };

    const patchRequestStatus = async (id, status) => {
        return await updateClinicRequestStatus(id, status);
    };

    const uploadReport = async (id, url_file) => {
        return await uploadClinicRequestReport(id, url_file);
    };
    const createCaseDetails = async (params) => {
        return await createAwsCaseDetails(params);
    };

    const sendPushNotificationToOrg = async (organization_id, notification) => {
        const userInfo = user?.message?.user || null;
        return await sendPushNotification(organization_id, notification, userInfo);
    };

    return (
        <ClinicRequestContext.Provider value={{ getRequestById, createRequest, updateRequest, getAllRequests, deleteRequest, checkPatientByNationality, processPayment, uploadPDF, sendOnlinePayment, getStats,
        patchRequestStatus, uploadReport, createCaseDetails, sendPushNotificationToOrg }}>
            {children}
        </ClinicRequestContext.Provider>
    );
};

export const useClinicRequest = () => useContext(ClinicRequestContext);
