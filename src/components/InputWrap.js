import React from "react";

const InputWrap = () => {
  return (
    <div className="input-wrap">
      <IoLocationSharp />
      <input
        type="text"
        name="city"
        id=""
        placeholder="Enter city name here."
      />
    </div>
  );
};

export default InputWrap;
