import React, { useState, useEffect } from "react";
import idleTimer from "idle-timer"; 
import SessionTimeout from "../Modals/Timeout/SessionTimeout";

const App = ({ data }) => {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const timer = idleTimer({
      // Function to fire after idle
      callback: callbackFn,
      // Function to fire when active
      activeCallback: activeCallbackFn,
      // Amount of time in milliseconds before becoming idle. Default 60000 (1 minute)
      idleTime: data,
    });

    function callbackFn() {
      console.log("You're Logged out!");
      setModal(true);

      setEvents((prevEvents) => [...prevEvents, "You're idle!"]);
    }

    function activeCallbackFn() {
      console.log("You're active!");
      setEvents((prevEvents) => [...prevEvents, "You're active!"]);
    }

    // Cleanup function to destroy the timer when the component unmounts
    return () => {
      timer.destroy();
    };
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const Close = () => {
    setModal(false);
    window.localStorage.clear();
    window.location.href = "./";
  };
  const Stay = () => {
    setModal(false);
  };

  return (
    <div>
      {modal && (
        <SessionTimeout
          closeModal={() => {Close()}}
          Stay={()=>{Stay()}}
        />
      )}
    </div>
  );
};

export default App;
