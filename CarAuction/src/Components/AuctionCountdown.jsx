
import { useState, useEffect } from "react";

function AuctionCountdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2">
      {["hrs", "mins", "secs"].map((unit, i) => (
        <div key={unit} className="flex items-center gap-2">
          <div className="bg-[#1E293B] text-white rounded-lg px-3 py-2 min-w-12 text-center">
            <span className="text-lg font-bold tabular-nums">
              {String(timeLeft[unit]).padStart(2, "0")}
            </span>
          </div>
          {i < 2 && <span className="text-white font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}

function getTimeLeft(endTime) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hrs: Math.floor(totalSeconds / 3600),
    mins: Math.floor((totalSeconds % 3600) / 60),
    secs: totalSeconds % 60,
  };
}

export default AuctionCountdown;