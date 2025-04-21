"use client"
import { BASE_URL } from '@/config';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'

function RoleOfCadImage({ styles, industry, part_name }) {
    const [designId,setDesignId] = useState('')
    useEffect(() => {
        getDesign() // Cleanup interval on component unmount
    }, []);
    const getDesign = async () => {
        try {
            const queryParam = part_name
                ? `part_name=${encodeURIComponent(part_name)}`
                : `industry=${encodeURIComponent(industry)}`;
    
            const response = await axios.get(`${BASE_URL}/v1/cad/get-design?${queryParam}`, {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"),
                }
            });
            setDesignId(response.data?.data?.design_id || '')
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    return (
        <div className={styles['role-of-cad-desgin']}>
            <Image src={`https://d1d8a3050v4fu6.cloudfront.net/${designId}/sprite_0_150.webp`} alt={part_name?part_name:industry} width={400} height={400} className={styles['role-of-cad-desgin-image']} />
        </div>
    )
}

export default RoleOfCadImage