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

    const [isClient, setIsClient] = useState(false);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userUuid, setUserUuid] = useState('');
    const [user, setUser] = useState({ name: '', email: '', photo: '' });
    const [errors, setErrors] = useState({ name: '', email: '' });

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (isClient) {
            const uuid = localStorage.getItem('uuid') || '';
            setUserUuid(uuid);
            getUserDetails(uuid);
        }
    }, [isClient]);

    const getUserDetails = async (uuid) => {
        try {
            const email = localStorage.getItem('user_email');
            const name = localStorage.getItem('user_name');
            const photo = localStorage.getItem('user_photo');

            if (email && name) {
                setUser({ name, email, photo });
                setIsProfileComplete(true);
                setIsEditing(false);
            } else {
                const res = await axios.get(`${BASE_URL}/v1/cad/get-user-details`, {
                    params: { uuid },
                    headers: { 'user-uuid': uuid }
                });

                if (res.data.meta.success) {
                    const data = res.data.data;
                    setUser({
                        email: data?.user_email || '',
                        name: data?.full_name || '',
                        photo: data?.photo || ''
                    });

                    if (data?.user_email && data?.full_name && data?.photo) {
                        localStorage.setItem('user_email', data.user_email);
                        localStorage.setItem('user_name', data.full_name);
                        localStorage.setItem('user_photo', data.photo);
                        setIsProfileComplete(true);
                        setIsEditing(false);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    const validateInputs = () => {
        const newErrors = { name: '', email: '' };
        let valid = true;

        if (!user.name.trim()) {
            newErrors.name = 'Full name is required';
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!emailRegex.test(user.email)) {
            newErrors.email = 'Enter a valid email';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleUserSubmit = async () => {
        if (!validateInputs()) return;

        try {
            const uuid = localStorage.getItem('uuid');
            const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
                uuid,
                user_email: user.email,
                full_name: user.name,
                photo: user.photo
            }, {
                headers: { 'user-uuid': uuid }
            });

            if (response.data.meta.success) {
                toast.success('Details Saved Successfully!');
                localStorage.setItem('user_email', user.email);
                localStorage.setItem('user_name', user.name);
                localStorage.setItem('user_photo', response.data.data);
                setIsProfileComplete(true);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error saving user details:", error);
            toast.error('Failed to save details.');
        }
    };

    const handleClick = () => photoInputRef.current?.click();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setUser(prev => ({ ...prev, photo: reader.result }));
        reader.readAsDataURL(file);
    };

    if (!isClient) return null;

    return (
        <div className={styles["tell-us-about-yourself-page"]}>
            <h2>{isProfileComplete && !isEditing ? 'Your Profile Details' : 'Tell Us About Yourself'}</h2>
            <p>We want you to feel secure, so we don't require a login...</p>

            <input type="file" ref={photoInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

            {isProfileComplete && !isEditing ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <NameProfile userName={user.name} width='100px' memberPhoto={user.photo} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                        </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className={styles['save-profile']}>
                        Edit Profile
                    </button>
                </>
            ) : (
                <>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '100%', gap: '1rem', marginBottom: '1rem'
                    }}>
                        <div className={styles["photo-upload"]} onClick={handleClick}>
                            <div style={{
                                width: '20px', height: '20px', position: 'absolute', bottom: '12px', right: '0px',
                                backgroundColor: '#610bee', borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/plus.svg' alt="plus" width={20} height={20} />
                            </div>
                            {user.photo ? (
                                !user.photo.startsWith('data') ? (
                                    <NameProfile userName={user.name} memberPhoto={user.photo} width={100} />
                                ) : (
                                    <Image src={user.photo} alt="User Photo" width={100} height={100} style={{ borderRadius: '50%' }} />
                                )
                            ) : (
                                <Image
                                    src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/profile-empty.png'
                                    alt="User Photo"
                                    width={100}
                                    height={100}
                                    style={{ borderRadius: '50%' }}
                                />
                            )}
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

            <div
                className={styles["unique-code"]}
                onClick={() => {
                    if (userUuid) {
                        navigator.clipboard.writeText(userUuid);
                        toast.success("Unique code copied to clipboard!");
                    }
                }}
                style={{ cursor: 'pointer' }}
            >
                Unique Code: {userUuid}
            </div>

            <p>Email us at <strong><a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a></strong> from the above email address with this code for any queries or support.</p>
            <hr className="my-8" />
        </div>
    );
}

export default TellUsAboutYourself;
