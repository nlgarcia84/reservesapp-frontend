import React from 'react';

export const Button = ({ buttonTitle, onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="bg-purple-700 text-white px-4 py-2 rounded-2xl w-fit ml-auto mr-auto"
      >
        {buttonTitle}
      </button>
    </>
  );
};
