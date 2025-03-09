/* Global styles and theme for the project */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const MOBILE_WIDTH = "768px";
export const APP_BAR_HEIGHT = "3.5rem";

export const AppBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: #202020;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${APP_BAR_HEIGHT};
  z-index: 1000;
`;

export const PageTitle = styled.h1`
  padding-left: 2rem; 
  padding-top: 1rem; 
  font-size: 2rem;
  color: white;
`;

export const PageTitleIcon = styled(FontAwesomeIcon)`
  font-size: 1.6rem;
  color: red;
  vertical-align: 0%;
  padding-left: .6rem;
`;

export const Logo = styled.a`
  font-weight: bold;
  color: #ff2f2f;
  margin: 0;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.6rem; 
  vertical-align: bottom;
`;

export const UserIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  color: white;
  cursor: pointer;
  margin-right: 3.5rem;
  cursor: pointer;
  color: white;
`;

export const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  background-color: #202020;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
`;

export const VideoTitle = styled.h3`
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: left;
  cursor: pointer;
`;

export const VideoStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  color: gray;
  margin: 5px 0;
`;

export const LikesDislikes = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
`;

export const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 14px;
  color: white;
`;

export const ChannelAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #181818;
  padding: 10px 0;
  z-index: 1000;
`;

export const Button = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  margin: 5px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

export const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  justify-content: center;
  padding: 20px;
  max-width: 100vw;
  overflow-x: hidden;
`;