import React from "react";
import { BallTriangle } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <BallTriangle
        color="#00BFFF"
        height={80}
        width={80}
        ariaLabel="Loading"
      />
    </div>
  );
};
export default Loader;
