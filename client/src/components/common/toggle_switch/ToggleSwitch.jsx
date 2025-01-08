import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ label }) => {
  return (
    <div className="container">
      Environment: 
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" id={label} name={label}/>
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
