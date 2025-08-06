import React from 'react';
import {PHOTO_LINK} from '@/config';
import Image from 'next/image'

function NameProfile({ userName, width, memberPhoto,fontSize,fontweight,padding,borderRadius, border }) {
    console.log("NameProfile component rendered with userName:", userName, "and memberPhoto:", memberPhoto);
    const renderInitials = () => {
        if (!userName) return '';
        const names = userName.split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        } else {
            return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
        }
    };

    return (
        <>
            {memberPhoto && !memberPhoto.startsWith('data:') ? (
                <Image width={parseInt(width)} 
                height={parseInt(width)}  style={{width:width,height:width,borderRadius:borderRadius?borderRadius: '50%',border:border?'1px solid #E2E8F0':'none'}}
                    src={!memberPhoto.includes(PHOTO_LINK)?PHOTO_LINK + memberPhoto:memberPhoto}
                    alt=""
                />
            ) : memberPhoto && memberPhoto.startsWith('data:') ? (
                <Image 
                    src={memberPhoto} 
                    alt="User Photo" 
                    width={parseInt(width)} 
                    height={parseInt(width)} 
                    style={{
                        borderRadius: borderRadius?borderRadius: '50%',
                        width: width,
                        height: width,
                        objectFit: 'cover',
                        border:border?'1px solid #E2E8F0':'none'
                    }} 
                />
            ) : (
                <div style={{
                    background: '#610bee',
                    borderRadius: borderRadius?borderRadius: '50%',
                    color: 'white', 
                    width: width,
                    height: width,
                    padding:padding,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border:border?'1px solid #E2E8F0':'none',
                    fontSize:fontSize,fontWeight:fontweight
                }}>
                    <span style={{margin:'0px'}}>{renderInitials()}</span>
                </div>
            )}
        </>
    );
}

export default NameProfile;
