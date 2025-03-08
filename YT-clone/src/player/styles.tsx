import styled from "styled-components";

export const PageContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  text-align: center;
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


export const VideoTitle = styled.h2`
  font-size: 20px;
  margin: 15px auto;
  margin-bottom: 0;
  text-align: left;
  width: 80%;
  max-width: 1200px;
`;

export const VideoStats = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: gray;
`;

export const LikesComments = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
`;

export const ChannelInfo = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  color: white;
  margin-top: 0px;
`;

export const ChannelAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const CommentsContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 20px auto;
  text-align: left;
  margin-top: 2.5rem;
  text-align: left;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
`;

export const CommentAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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