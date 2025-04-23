import React from 'react'
import styles from './Industry.module.css'
import { BASE_URL } from '@/config';
import Link from 'next/link';

async function SampleParts({ industry, part_name }) {
   
    try {
        

        const response = await fetch(
            `${BASE_URL}/v1/cad/get-industry-part-data?industry=${industry}`,
            {
                method: 'GET',
             
                cache: 'no-store'
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
            <>
            {data.length ? <div className={styles['sample-parts']}>
                <h2>Sample Parts (CAD Viewable in Marathon-OS)</h2>

                <div className={styles['sample-parts-container']}>
                    {
                        data.map((item, index) => (
                            <Link
                                href={`/industry/${industry}/${item.route}`}
                                key={item.id || index}
                                passHref
                            >
                                <button
                                    className={styles['sample-parts-box']}
                                >
                                    {item.part_name || `Part ${index + 1}`}
                                </button>
                            </Link>
                        ))}
                    
                </div>
            </div>:<></>}
            
            </>
           
        );
    } catch (error) {
        console.error("Failed to fetch sample parts:", error);


    }
}

export default SampleParts;