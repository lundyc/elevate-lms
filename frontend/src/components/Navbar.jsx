import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1>Elevate LMS</h1>
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span>{user.name}</span>
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log out</button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      )}
    </nav>
  );
};

export default Navbar;
