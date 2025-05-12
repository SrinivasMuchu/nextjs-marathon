'use client';
import React, { useState } from 'react'

function Dummy() {
    const [testEmail, setTestEmail] = useState('');
    console.log(testEmail, 'testEmail');
    return (
        <div>
            <input
                type="text"
                placeholder="Enter your email"
                // value={testEmail}
                onChange={(e) => alert(e.target.value)}
                // onChange={(e) => {
                //     setTestEmail(e.target.value);
                //     alert(`${e.target.value} email`);
                // }}
            />
        </div>
    )
}

export default Dummy
