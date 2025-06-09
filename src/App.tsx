import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./theme";
import { useAppSelector } from "./redux/hooks";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
