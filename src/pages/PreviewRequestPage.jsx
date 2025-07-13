import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClinicRequest } from '../contexts/ClinicRequestContext';
import PreviewRequest from '../components/PreviewRequest';

export default function PreviewRequestPage() {
    const { id } = useParams();
    const { getRequestById } = useClinicRequest();

    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRequestById(id);

                setRequestData(data);
            } catch (error) {
                console.error("Error fetching the request", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, getRequestById]);

    if (loading) return <div>Loading...</div>;
    if (!requestData) return <div>Request not found.</div>;

    return (
        <div>
            <h2>Request Preview {id}</h2>
            <PreviewRequest initialData={requestData} />
        </div>
    );
}
