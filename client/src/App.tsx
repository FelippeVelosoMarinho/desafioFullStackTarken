import { ThemeProvider } from "styled-components";
import Routes from "./services/routes";
import GlobalStyle from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <GlobalStyle />
      <Routes />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
