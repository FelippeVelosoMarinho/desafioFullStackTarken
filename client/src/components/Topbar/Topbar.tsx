import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { theme } from "../../styles/theme";
import Moovy from "../../assets/moovy.svg";

import { TopbarBox } from "./index.tsx";

function Topbar() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
  };

  return (
    <>
      <TopbarBox>
        <AppBar position="relative" sx={{ background: "transparent", boxShadow: "none" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontFamily: "Inter, sans-serif" }}
              >
                <img src={Moovy} alt="Moovy" style={{ height: 25 }} />
              </Typography>
            </IconButton>

            <Button
              onClick={() => handleOptionClick("search")}
              sx={{
                color:
                  selectedOption === "search" ? theme.colors.primary : "black",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleOptionClick("myLibrary")}
              sx={{
                color:
                  selectedOption === "myLibrary"
                    ? theme.colors.primary
                    : "black",
                fontFamily: "Inter, sans-serif",
              }}
            >
              My Library
            </Button>
          </Toolbar>
        </AppBar>
      </TopbarBox>
      <Outlet />
    </>
  );
}

export default Topbar;
