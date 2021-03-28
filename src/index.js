import React from "react";
import ReactDOM from "react-dom";
import Game from "./components/Game";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#ef9a9a",
      main: "#ef5350",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#00000",
      dark: "#ba000d",
      contrastText: "#000",
    },
    action: {
      disabledBackground: "grey",
      disabled: "white",
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Game />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
