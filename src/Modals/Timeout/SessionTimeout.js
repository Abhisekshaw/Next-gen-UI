import React, { useEffect} from "react";
import idleTimer from "idle-timer"; 

function StateModals({ closeModal, Stay }) {
 
    useEffect(() => {
        const timer = idleTimer({
          // Function to fire after idle
          callback: callbackFn,
          // Function to fire when active
         
          // Amount of time in milliseconds before becoming idle. Default 60000 (1 minute)
          idleTime: 10000,
        });
    
        function callbackFn() {
          console.log("You're Logged out!");
          window.localStorage.clear();
          window.location.href = "./";
        }
    
    
        return () => {
          timer.destroy();
        };
      }, []);

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
      <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl">
     
        <div className="mt-4 mb-6">
          <form action="">
          <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Session Timeout</h5>
       
      </div>
      <div class="modal-body">
        <p>You've been logged out as you were inactive for 5 Minutes</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" style={{backgroundColor:"#7e3af2"}} onClick={Stay}>Stay Logged In</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Logout</button>
      </div>
    </div>
  </div>
          </form>
        </div>
  
      </div>
    </div>
  );
}

export default StateModals;
