'use client';

import Loading from '@/Components/CommonJsx/Loaders/Loading';
import IndustryDesignClone from '@/Components/IndustryDesigns/IndustryDesignClone';
import { BASE_URL } from '@/config';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

function Page({ params }) {
    const [designData, setDesignData] = useState(null);
    const [loading, setLoading] = useState(true);
    const design = params.design_id;

    useEffect(() => {
        async function fetchDesignData() {
            try {
                const searchParams = new URLSearchParams({
                    industry_design_route: design,
                });

                const headers = {
                    'Content-Type': 'application/json',
                };

                // Add adminuuid from localStorage if available
                const adminuuid = localStorage.getItem('admin-uuid');
                if (adminuuid) {
                    headers['admin-uuid'] = adminuuid;
                }

                const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?${searchParams}`, {
                    method: 'GET',
                    cache: 'no-store',
                    headers,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!data.data) {
                    notFound();
                }

                const normalizedData = {
                    ...data.data,
                    report: data.data.report,
                };

                setDesignData(normalizedData);
            } catch (error) {
                console.error("Failed to fetch design data:", error);
                notFound();
            } finally {
                setLoading(false);
            }
        }

        fetchDesignData();
    }, [design]);

    if (loading) {
        return <Loading />;
    }

    if (!designData) {
        return null;
    }

    return <IndustryDesignClone design={design} designData={designData} type='library'/>;
}
export default Page