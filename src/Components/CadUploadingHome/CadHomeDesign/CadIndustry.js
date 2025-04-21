import React from 'react';
import axios from 'axios';
import { MARATHON_ASSET_PREFIX_URL, BASE_URL } from '@/config';
import styles from './CadHome.module.css';
import { textLettersLimit } from '@/common.helper';
import CadIndustryHeads from './CadIndustryHeads';
import { cookies } from 'next/headers';

async function getIndustryData() {
    try {
        const cookieStore = cookies();
        const userUuid = cookieStore.get('uuid')?.value || ''; // adjust 'uuid' if cookie name is different

        const response = await axios.get(`${BASE_URL}/v1/cad/get-industry-data`, {
            headers: {
                'user-uuid': userUuid,
            },
        });

        return response.data?.data || [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export default async function CadIndustry() {
    const data = await getIndustryData();

    return (
        <div className={styles['cad-industries']}>
            <div className={styles['cad-industries-content']}>
                <CadIndustryHeads />
            </div>

            <div className={styles['cad-industries-items']}>
                {data.map((item) => (
                    <a href={`/industry/${item.route}`} key={item._id}>
                        <div className={styles['cad-industries-item-cont']}>
                            <div className={styles['cad-industries-item-cont-head']} >
                                <img
                                    src={`${MARATHON_ASSET_PREFIX_URL}${item.logo}`}
                                    alt={item.industry}
                                    width={150}
                                    height={150}
                                    className={styles['cad-industries-item-cont-img']}
                                />
                                <h6>{item.industry}</h6>
                            </div>
                            
                            <p>{item.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
