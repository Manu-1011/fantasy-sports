import React, { useState, useEffect, useRef } from 'react';
import { MdAccessTime } from 'react-icons/md';

const CountdownTimer = ({ matchDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!matchDate) {
      setTimeLeft(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const calculateTimeLeft = () => {
      try {
        const now = new Date().getTime();
        const matchTime = new Date(matchDate).getTime();
        
        if (isNaN(now) || isNaN(matchTime)) {
          return null;
        }

        const difference = matchTime - now;

        if (difference <= 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          expired: false
        };
      } catch (error) {
        console.error('Error calculating time left:', error);
        return null;
      }
    };

    const updateTimer = () => {
      const calculated = calculateTimeLeft();
      if (calculated === null) {
        setTimeLeft(null);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      
      setTimeLeft(calculated);
      
      if (calculated.expired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    updateTimer();

    if (!intervalRef.current) {
      intervalRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matchDate]);

  if (!timeLeft) {
    return <span className="text-muted">Time TBD</span>;
  }

  if (timeLeft.expired) {
    return <span className="text-danger">Match Started</span>;
  }

  const formatTime = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
    }
  };

  return (
    <span className="text-primary fw-bold d-flex align-items-center gap-1">
      <MdAccessTime /> {formatTime()}
    </span>
  );
};

export default CountdownTimer;

