import React, { useEffect, useRef, useState } from 'react';
import usePayPalScript from '../hooks/usePayPalScript';

const PayPalButton = ({ amount, onSuccess, onError, planId }) => {
    const clientId = 'ARlHuZ2PYknKHbkn1se9E34ikMhXWSsFnhyWWFwFAyTx9UbgX2643F3AH_hblq8R_9WIi0JLT1kiDIrE';
    usePayPalScript(clientId);
    const buttonRef = useRef(null);
    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.paypal) {
                setSdkReady(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (sdkReady && buttonRef.current && buttonRef.current.children.length === 0) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount,
                            },
                        }],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        onSuccess(details);
                    });
                },
                onError: (err) => {
                    onError(err);
                },
            }).render(buttonRef.current);
        }
    }, [sdkReady, amount, onSuccess, onError, planId]);

    return <div ref={buttonRef} id={`paypal-button-container-${planId}`} data-testid={`paypal-button-container-${planId}`}></div>;
};

export default PayPalButton;
