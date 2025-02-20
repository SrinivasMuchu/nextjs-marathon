import React from 'react';
import {PHOTO_LINK} from '@/config';

function NameProfile({ userName, width, memberPhoto,fontSize,fontweight,padding,borderRadius }) {
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
            {memberPhoto ? (
                <img style={{width:width,height:width,borderRadius:borderRadius?borderRadius: '50%',}}
                    src={PHOTO_LINK + memberPhoto}
                    alt=""
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
                    // borderRadius:borderRadius,
                    fontSize:fontSize,fontWeight:fontweight
                }}>
                    <span>{renderInitials()}</span>
                </div>
            )}
        </>
    );
}

export default NameProfile;
