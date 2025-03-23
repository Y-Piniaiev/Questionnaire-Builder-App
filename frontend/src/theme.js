import { createTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6A1B9A",
    },
    secondary: {
      main: "#FF4081",
    },
    background: {
      default: "#F4F5F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2E3A59",
      secondary: "#8C9CAD",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#2E3A59",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      color: "#2E3A59",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      color: "#2E3A59",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#2E3A59",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "8px",
          padding: "10px 20px",
          transition: "all 0.3s ease",
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #6A1B9A, #8E24AA)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(106, 27, 154, 0.3)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #FF4081, #FF6F61)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(255, 64, 129, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
  },
});

const globalStyles = (
  <>
    <CssBaseline />
    <GlobalStyles
      styles={{
        body: {
          margin: 0,
          padding: 0,
          fontFamily: "'Poppins', sans-serif",
          backgroundColor: "#F4F5F7",
          color: "#2E3A59",
        },
        ".container": {
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        },
        "h1, h2, h3, h4, h5, h6": {
          color: "#2E3A59",
          marginBottom: "16px",
        },
        button: {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        ".my-card": {
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          },
        },
        form: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
        "input, textarea, select": {
          padding: "12px",
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
          fontSize: "1rem",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        },
        "input:focus, textarea:focus, select:focus": {
          borderColor: "#6A1B9A",
          boxShadow: "0 0 8px rgba(106, 27, 154, 0.2)",
          outline: "none",
        },
        table: {
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        },
        "th, td": {
          padding: "12px",
          textAlign: "left",
          borderBottom: "1px solid #E0E0E0",
        },
        th: {
          backgroundColor: "#6A1B9A",
          color: "white",
        },
        a: {
          color: "#6A1B9A",
          textDecoration: "none",
          transition: "color 0.3s ease",
          "&:hover": {
            color: "#FF4081",
          },
        },
        ".loading-spinner": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        },
        ".chart-container": {
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  </>
);

export { theme, globalStyles };
