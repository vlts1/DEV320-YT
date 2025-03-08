import styled from "styled-components";

export const PageContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  text-align: start;
  background-color: #181818;
  color: white;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
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
  width: 36px;
  height: 36px;
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