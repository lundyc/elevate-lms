import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Installer from './pages/Installer';
import DashboardSys from './pages/DashboardSys';
import DashboardClub from './pages/DashboardClub';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardPlayer from './pages/DashboardPlayer';
import GameList from './pages/GameList';
import GameCreate from './pages/GameCreate';
import GameDetails from './pages/GameDetails';

const App = () => {
  const { isLoading, isAuthenticated, user } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  // Determine role from user metadata (assuming stored in app_metadata)
  const role = user?.['https://elevate-lms/roles']?.[0];

  // Installer route
  if (!import.meta.env.VITE_INSTALLER_COMPLETE) {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/*" element={<Installer />} />
        </Routes>
      </>
    );
  }

  // Authenticated routes
  return (
    <>
      <Navbar />
      <Routes>
        {isAuthenticated ? (
          <>
            {role === 'sysadmin' && (
              <>
                <Route path="/sys/dashboard" element={<DashboardSys />} />
                <Route path="/sys/games" element={<GameList />} />
                <Route path="/sys/games/create" element={<GameCreate />} />
                <Route path="/sys/games/:id" element={<GameDetails />} />
              </>
            )}
            {role === 'group_admin' && (
              <>
                <Route path="/club/dashboard" element={<DashboardClub />} />
                <Route path="/club/games" element={<GameList />} />
                <Route path="/club/games/create" element={<GameCreate />} />
              </>
            )}
            {role === 'admin' && (
              <>
                <Route path="/team/dashboard" element={<DashboardAdmin />} />
                <Route path="/team/games" element={<GameList />} />
                <Route path="/team/games/create" element={<GameCreate />} />
              </>
            )}
            {role === 'player' && (
              <>
                <Route path="/player/dashboard" element={<DashboardPlayer />} />
                <Route path="/player/games" element={<GameList />} />
                <Route path="/player/games/:id" element={<GameDetails />} />
              </>
            )}
            {/* Fallback */}
            <Route path="*" element={<Navigate to={`/${role}/dashboard`} />} />
          </>
        ) : (
          // Unauthenticated users redirected to login (Auth0 login)
          <Route path="*" element={<button onClick={() => loginWithRedirect()}>Log in</button>} />
        )}
      </Routes>
    </>
  );
};

export default App;
