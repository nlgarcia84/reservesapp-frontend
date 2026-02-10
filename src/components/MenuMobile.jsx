import React from 'react';

export const MenuMobile = ({ displayMenu }) => {
  return (
    <>
      <div
        className={`flex flex-col text-center p-5 bg-slate-200 text-lg ${displayMenu} z-1`}
      >
        <a href="">Inici</a>
        <a href="">Reservar Sales</a>
        <a href="">Sales</a>
        <a href="">Reserves</a>
      </div>
    </>
  );
};
