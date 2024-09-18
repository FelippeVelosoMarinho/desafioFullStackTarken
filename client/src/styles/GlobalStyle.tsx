import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: "Inter, sans-serif";
    }

    .Routes {
      display: grid;
      height: 100vh;
      grid-template-areas: "nav main";
      grid-template-columns: 180px 1fr;
    }

    .Routes .dashboard {
      grid-area: main;
    }

    .Routes .navbar {
      grid-area: nav;
    }

    @media (max-width: 768px) {
      .Routes {
        grid-template-areas: "nav" "main";
        grid-template-rows: 90px 1fr;
        grid-template-columns: 1fr;
      }
    }

    `;

export default GlobalStyle;
