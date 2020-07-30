import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => (props.blackColor ? "white" : "black")};
    background-color:${props => (!props.blackColor ? "white" : "black")};
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  * {
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .myContainer {
    width: 1200px;
    margin: auto;
    @media (max-width: 1200px) {
      width: 100%;
      padding: 0 15px;
    }
  }
`;

export { GlobalStyle };
