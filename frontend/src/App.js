import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme, globalStyles } from "./theme";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import RunPage from "./pages/RunPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/run/:id" element={<RunPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
