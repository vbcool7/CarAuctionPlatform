
import { useState, useEffect } from 'react';

export function UseCountdown(targetDateTime) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        if (!targetDateTime) return;
        const interval = setInterval(() => {
            const diff = new Date(targetDateTime) - new Date();
            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                mins: Math.floor((diff / (1000 * 60)) % 60),
                secs: Math.floor((diff / 1000) % 60),
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDateTime]);

    return timeLeft;
}