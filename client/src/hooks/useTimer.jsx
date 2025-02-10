import { useState, useEffect, useCallback } from "react";

export const useTimer = () => {
  const calculateTimeLeft = useCallback((createdTime, durationMinutes) => {
    const createdDate = new Date(createdTime);
    const endTime = new Date(createdDate.getTime() + durationMinutes * 60 * 1000);
    const now = new Date();
    const remainingTime = endTime - now;

    return remainingTime > 0
      ? {
          minutes: Math.floor(remainingTime / 60000),
          seconds: Math.floor((remainingTime % 60000) / 1000),
        }
      : { minutes: 0, seconds: 0 };
  }, []);

  return {calculateTimeLeft};
};
