import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { VideoPlayer } from './player/VideoPlayer.tsx';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { TrendingVideosPage } from './trending/TrendingVideosPage.tsx';
import { Profile } from './profile/Profile.tsx';

export const APP_BAR_HEIGHT = "3.5rem";
export const BORDER_PADDING = "2rem";

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

const AppBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${BORDER_PADDING};
  padding-right: ${BORDER_PADDING};
  background-color: #202020;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${APP_BAR_HEIGHT};
  z-index: 1000;
`;

const Logo = styled.a`
  font-size: 1.4rem;
  font-weight: bold;
  color: #ff2f2f;
  margin: 0;
  cursor: pointer;
  text-decoration: none;
`;

const UserIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  color: white;
  cursor: pointer;
  margin-right: 3.5rem;
  cursor: pointer;
  color: white;
`;

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <GlobalStyle />
      <AppBar>
        <Logo href={"/"}><FontAwesomeIcon icon={faVideoCamera} style={{color: "red", fontSize: "1.6rem", verticalAlign: "bottom"}}/> YouTube Clone</Logo>
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
