import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { MenuMobile } from './MenuMobile';

export const Header = () => {
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="flex justify-between text-white bg-purple-700 p-5">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={menu ? faBars : faX}
            className="pr-2"
            id="menumobile"
            onClick={() => setMenu(!menu)}
          />
          <h1>ReservesApp Dashboard</h1>
        </div>
        <div className="flex justify-around">
          <div className="flex">
            <FontAwesomeIcon icon={faUser} className="pr-2" />
            <h2>Usuari</h2>
          </div>
        </div>
      </div>
      <MenuMobile displayMenu={menu ? 'hidden' : 'block'} />
    </>
  );
};
