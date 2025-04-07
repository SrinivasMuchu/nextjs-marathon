import React from 'react'
import styles from './Industry.module.css'
import { cookies } from 'next/headers'
import { BASE_URL } from '@/config';
import Link from 'next/link';

async function SampleParts({ industry, part_name }) {
    const cookieStore = cookies();
    const userUUID = cookieStore.get('uuid')?.value;

    try {
        const headers = {
            'user-uuid': userUUID || '',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const response = await fetch(
            `${BASE_URL}/v1/cad/get-industry-part-data?industry=${industry}`,
            {
                method: 'GET',
                headers,
                next: { revalidate: 3600 }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        let data = result.data || [];

        // Filter out parts that match the part_name
        if (part_name) {
            data = data.filter(item =>
                !item.route?.toLowerCase().includes(part_name.toLowerCase()) &&
                !item.id?.toLowerCase().includes(part_name.toLowerCase()) &&
                !item.part_name?.toLowerCase().includes(part_name.toLowerCase())
            );
        }

        return (
            <div className={styles['sample-parts']}>
                <h2>Sample Parts (CAD Viewable in Marathon-OS)</h2>

                <div className={styles['sample-parts-container']}>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <Link
                                href={`/Industries/${industry}/${item.route}`}
                                key={item.id || index}
                                passHref
                            >
                                <button
                                    className={styles['sample-parts-box']}
                                >
                                    {item.part_name || `Part ${index + 1}`}
                                </button>
                            </Link>
                        ))
                    ) : (
                        <div className={styles['no-results']}>
                            {part_name ? `No other parts found (excluding "${part_name}")` : 'No parts available'}
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch sample parts:", error);


    }
}

export default SampleParts;