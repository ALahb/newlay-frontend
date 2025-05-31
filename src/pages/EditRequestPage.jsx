import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditRequest from '../components/EditRequest';
import { useClinicRequest } from '../context/ClinicRequestContext';

export default function EditRequestPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getRequestById, updateRequest } = useClinicRequest();

    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Récupérer la requête à éditer depuis le backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRequestById(id);
                setRequestData(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de la requête", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, getRequestById]);

    const handleUpdate = async (updatedData) => {
        try {
            await updateRequest(id, updatedData);
            navigate('/'); // redirection après succès
        } catch (error) {
            console.error("Erreur lors de la mise à jour", error);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (!requestData) return <div>Requête non trouvée.</div>;

    return (
        <div>
            <h2>Modifier la requête #{id}</h2>
            <EditRequest initialData={requestData} onSubmit={handleUpdate} />
        </div>
    );
}
