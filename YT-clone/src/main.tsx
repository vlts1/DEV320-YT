import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { VideoPlayer } from './player/VideoPlayer.tsx';
import { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { TrendingVideosPage } from './trending/TrendingVideosPage.tsx';
import { Profile } from './profile/Profile.tsx';
import { APP_BAR_HEIGHT, AppBar, Logo, UserIcon } from './styles.tsx';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    padding-left: "2rem";
    padding-right: "2rem";
    background-color: #181818;
    font-family: 'Roboto', sans-serif;
  }
`;

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <GlobalStyle />
      <AppBar>
        <Logo href={"/"}><FontAwesomeIcon icon={faVideoCamera}/> YouTube Clone</Logo>
        <UserIcon icon={faUser} onClick={() => navigate('/profile')} />
      </AppBar>
        <div style={{ marginTop: APP_BAR_HEIGHT}}>
        <Routes>
          <Route path="/" element={<TrendingVideosPage />} />
          <Route path="/play/:videoId" element={<VideoPlayer />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AppLayout />
    </StrictMode>
  </BrowserRouter>
);
