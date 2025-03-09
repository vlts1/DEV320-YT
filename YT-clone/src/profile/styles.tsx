import styled from "styled-components";

export const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 320px);
  gap: 20px;
  justify-content: center;
  padding: 20px;
  overflow-x: hidden;
`;