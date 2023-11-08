import React, { useState, useEffect } from "react";
import "./InternetConnectionStatus.scss";

const InternetConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMessage(true);
      // Automatically hide the message after 2 seconds
      setTimeout(() => {
        setShowOnlineMessage(false);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      {showOnlineMessage && (
        <div className="internet-overlay online">
          <p>You are now back online.</p>
        </div>
      )}
      {!isOnline && (
        <div className="internet-overlay">
          <p>You are currently offline.</p>
        </div>
      )}
    </div>
  );
};

export default InternetConnectionStatus;
