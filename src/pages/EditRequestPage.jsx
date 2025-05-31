import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditRequest from '../components/EditRequest';

export default function EditRequestPage({ requests, setRequests }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Trouver la demande à éditer par ID (id est string, id dans requests est number)
    const requestToEdit = requests.find((req) => req.id === Number(id));

    if (!requestToEdit) {
        return <div>Request not found</div>;
    }

    // Fonction appelée à la soumission du formulaire
    const handleUpdate = (updatedData) => {
        setRequests((prevRequests) =>
            prevRequests.map((req) =>
                req.id === Number(id) ? { ...req, ...updatedData } : req
            )
        );
        navigate('/'); // revenir à la liste après sauvegarde
    };

    return (
        <div>
            <h2>Edit Request #{id}</h2>
            <EditRequest initialData={requestToEdit} onSubmit={handleUpdate} />
        </div>
    );
}
