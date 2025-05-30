'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';
import NameProfile from "@/Components/CommonJsx/NameProfile";
import axios from 'axios';
import { BASE_URL } from '@/config';

function TellUsAboutYourself() {
    const photoInputRef = useRef(null);
    const handleClick = () => photoInputRef.current?.click();

    const [isClient, setIsClient] = useState(false);
    const [update, setUpdate] = useState(false);
    const [user, setUser] = useState({ name: '', email: '', photo: '' });
    const [userUuid, setUserUuid] = useState('');
    const [errors, setErrors] = useState({ name: '', email: '' });

    useEffect(() => {
        setIsClient(true); // mark component as client-side
    }, []);

    useEffect(() => {
        if (isClient) {
            const uuid = localStorage.getItem('uuid') || '';
            setUserUuid(uuid);
            getUserDetails(uuid);
        }
    }, [update, isClient]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setUser(prev => ({ ...prev, photo: reader.result }));
        reader.readAsDataURL(file);
    };

    const validateInputs = () => {
        const newErrors = { name: '', email: '' };
        let isValid = true;

        if (!user.name.trim()) {
            newErrors.name = 'Full name is required';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(user.email)) {
            newErrors.email = 'Enter a valid email address';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUserSubmit = async () => {
        if (!validateInputs()) return;

        try {
            const uuid = localStorage.getItem("uuid");
            const response = await axios.post(
                `${BASE_URL}/v1/cad/create-user-details`,
                {
                    uuid,
                    user_email: user.email,
                    full_name: user.name,
                    photo: user.photo
                },
                {
                    headers: {
                        "user-uuid": uuid,
                    }
                }
            );
            if (response.data.meta.success) {
                toast.success('Details Saved Successfully!');
                setUpdate(!update); // trigger re-fetch
            }
        } catch (error) {
            console.error('Error uploading user details:', error);
        }
    };

    const getUserDetails = async (uuid) => {
        try {
            const storedEmail = localStorage.getItem('user_email');
            const storedName = localStorage.getItem('user_name');
            const storedPhoto = localStorage.getItem('user_photo');

            if (!storedEmail || !storedName || !storedPhoto) {
                const response = await axios.get(`${BASE_URL}/v1/cad/get-user-details`, {
                    params: { uuid },
                    headers: { "user-uuid": uuid }
                });

                if (response.data.meta.success) {
                    const data = response.data.data;
                    localStorage.setItem('user_email', data?.user_email || '');
                    localStorage.setItem('user_name', data?.full_name || '');
                    localStorage.setItem('user_photo', data?.photo || '');

                    setUser({
                        email: data?.user_email || '',
                        name: data?.full_name || '',
                        photo: data?.photo || ''
                    });
                }
            } else {
                setUser({
                    email: storedEmail,
                    name: storedName,
                    photo: storedPhoto
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    if (!isClient) return null; // avoids SSR crash

    return (
        <div className={styles["tell-us-about-yourself-page"]}>
            <h2>{!update ? 'Your Profile Details' : 'Tell Us About Yourself'}</h2>
            <p>We want you to feel secure, so we don't require a login...</p>

            <input type='file' ref={photoInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

            {user.email && user.name && user.photo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <NameProfile userName={user.name} width='100px' memberPhoto={user.photo} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', width: '100%', gap: '1rem', marginBottom: '1rem'
                    }}>
                        <div className={styles["photo-upload"]} onClick={handleClick}>
                            <div style={{
                                width: '20px', height: '20px', position: 'absolute', bottom: '12px', right: '0px',
                                backgroundColor: '#610bee', borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/plus.svg' alt="plus" width={20} height={20} />
                            </div>
                            {user.photo ?
                                <Image src={user.photo} alt="User Photo" width={100} height={100} style={{ borderRadius: '50%' }} />
                                :
                                <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/profile-empty.png' alt="User Photo" width={100} height={100} style={{ borderRadius: '50%' }} />}
                        </div>
                    </div>

                    <input
                        placeholder="Your Name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                    {errors.name && <p style={{ color: 'red', marginTop: '-0.5rem' }}>{errors.name}</p>}

                    <input
                        placeholder="Your Email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    {errors.email && <p style={{ color: 'red', marginTop: '-0.5rem' }}>{errors.email}</p>}

                    <button onClick={handleUserSubmit} className={styles['save-profile']}>
                        Save Profile Information
                    </button>
                </>
            )}

            <div className={styles["unique-code"]}>
                Unique Code: {userUuid}
            </div>
            <p>Email us at <strong><a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a></strong> from the above email address with this code for any queries or support.</p>
            <hr className="my-8" />
        </div>
    );
}

export default TellUsAboutYourself;
