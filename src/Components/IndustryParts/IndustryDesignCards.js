"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndustryDesignParallelaxWrapper from './IndustryDesignParallelaxWrapper';
import { BASE_URL } from '@/config';
import { textLettersLimit } from '@/common.helper';
import Image from 'next/image';

function IndustryDesignCards({ styles,part_name,industry }) {
    const [capabilities, setCapabilities] = useState([]);
  

    useEffect(() => {
        const fetchCapabilities = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/v1/cad/get-part-designs`, {
                    params: { 
                        part_name, 
                       
                    },
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security
                        
                    }
                });
                console.log(response)
                setCapabilities(response.data.data.response);
               
            } catch (err) {
               
             
                console.error('Error fetching capabilities:', err);
            }
        };

        fetchCapabilities();
    }, []);

   

    return (
        <>
            {capabilities.map((capability, index) => (
                <IndustryDesignParallelaxWrapper key={index} styles={styles}>
                    <a href={`/industry/${industry}/${part_name}/${capability.grabcad_title}`}>
                    <div className={styles['capabilities-img-cont']}>
                        {/* Uncomment when you have images */}
                        <Image
                            src={ `https://d1d8a3050v4fu6.cloudfront.net/${capability._id}/sprite_0_150.webp`}
                            alt={capability.grabcad_title}
                            className={styles['capabilities-img']}
                            width={100}
                            height={150}
                        />
                    </div>
                    <div className={styles['capabilities-page-card-text']}>
                        <h6 className={styles['capabilities-page-card-head']}>
                            {textLettersLimit(capability.grabcad_title,15)}
                           
                        </h6>
                        <p className={styles['capabilities-page-card-desc']}>
                        {textLettersLimit(capability.grabcad_description,45)}
                           
                        </p>
                    </div>
                    </a>
                    
                </IndustryDesignParallelaxWrapper>
            ))}
        </>
    );
}

export default IndustryDesignCards;