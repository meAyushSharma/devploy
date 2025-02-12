import { useState, useEffect } from "react";

const Timer = ({ createdTime, recallFun }) => {
  const createdDate = new Date(createdTime); // Convert string to Date object
  const endTime = new Date(createdDate.getTime() + 16 * 60 * 1000); // Add 16 minutes

  const calculateTimeLeft = () => {
    const now = new Date();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
      return { minutes: 0, seconds: 0 };
    }

    return {
      minutes: Math.floor(remainingTime / 60000),
      seconds: Math.floor((remainingTime % 60000) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if(timeLeft.minutes + timeLeft.seconds == 0){
      setTimeout(recallFun, 60*1000);
    }
  }, [timeLeft, recallFun]);

  return (
    <div className={`${(timeLeft.minutes + timeLeft.seconds) ? "": "text-rose-500"}`}>
      {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default Timer;
