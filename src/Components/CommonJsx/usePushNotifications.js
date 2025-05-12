'use client';

import { useCallback } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';

export default function usePushNotifications() {
    const registerPush = useCallback(async (email = '') => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications not supported.');
            return;
        }

        try {
            // Request notification permissions
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission not granted.');
                return;
            }

            // Register the service worker
            const reg = await navigator.serviceWorker.register('/sw.js');

            // Subscribe the user to push notifications
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                ),
            });

            const accessKey = sub.endpoint;
            const uuid = localStorage.getItem('uuid');

            // Send subscription details to the backend
            const result = await axios.post(`${BASE_URL}/v1/cad/user-access`, {
                accessKey: sub,
                email,
                uuid
            });

            if (result.data.meta.success) {
                // Store email and access key if provided
                if (email) {
                    localStorage.setItem('user_email', email);
                }
                localStorage.setItem('user_access_key', accessKey);
                console.log('Push subscription sent to server successfully');
            }

            console.log('✅ Push subscription saved successfully');
        } catch (err) {
            console.error('❌ Push registration failed:', err);
        }
    }, []);

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
    }

    return registerPush;
}
