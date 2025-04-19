"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config';
import styles from "./CadHome.module.css";
import { textLettersLimit } from '@/common.helper';
import CadIndustryHeads from './CadIndustryHeads';

function CadIndustry() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/v1/cad/get-industry-data`, {
                    headers: {
                        "user-uuid": localStorage.getItem('uuid'),
                    }
                });
                setData(response.data?.data || []); // assuming response.data.data is the array
                console.log('API Response:', response.data);
            } catch (err) {
                setError(err);
                console.error('API Error:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles["cad-industries"]}>
            <div className={styles["cad-industries-content"]}>
                <CadIndustryHeads/>
            </div>

            <div className={styles["cad-industries-items"]}>
               

                {
                    data.map((item) => (
                        <a href={`/industry/${item.route}`}>
                            <div key={item._id} className={styles["cad-industries-item-cont"]}>
                                <h6>{item.industry}</h6>
                                <p>{textLettersLimit(item.meta_description, 80)}</p>
                            </div>
                        </a>

                    ))
                }
            </div>
        </div>
    );
}

export default CadIndustry;
