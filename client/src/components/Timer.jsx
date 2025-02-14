import { useState, useEffect } from "react";

const Timer = ({ createdTime, recallFun }) => {
  const createdDate = new Date(createdTime);
  const endTime = new Date(createdDate.getTime() + 16 * 60 * 1000);

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
      setTimeLeft(prevTime => {
        if (prevTime?.minutes === 0 && prevTime?.seconds === 0) {
          clearInterval(timer);
          setTimeout(recallFun, 70 * 1000);
          return prevTime;
        }
  
        return calculateTimeLeft();
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);
  


  return (
    <div className={`${(timeLeft.minutes + timeLeft.seconds) ? "": "text-rose-500"}`}>
      {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default Timer;
