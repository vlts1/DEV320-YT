import { TrendingVideosPage } from "./TrendingVideosPage"
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #181818;
  }
`;

export const App = () => (
  <>
    <GlobalStyle />
    <TrendingVideosPage />
  </>
);
