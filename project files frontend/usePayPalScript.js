import { useEffect } from 'react';

const usePayPalScript = (clientId) => {
    useEffect(() => {
        const scriptId = 'paypal-sdk-script';
        const existingScript = document.getElementById(scriptId);

        if (!existingScript) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
            script.async = true;
            script.onload = () => {
                console.log('PayPal SDK loaded successfully');
            };
            script.onerror = () => {
                console.error('Failed to load PayPal SDK');
            };
            document.body.appendChild(script);
        }
    }, [clientId]);
};

export default usePayPalScript;
