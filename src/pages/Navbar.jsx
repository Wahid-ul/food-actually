import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import {
  Restaurant,
  Logout,
  Login,
} from "@mui/icons-material";

import { logout } from "../utils/auth";


const Navbar = ({
  isLoggedIn,
  userName,
}) => {

  const navigate = useNavigate();


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {

    await logout();

    localStorage.removeItem("loggedIn");

    navigate("/login");

  };


  return (

    <div
      className="dashboard-header"
    >

      {/* =====================================================
          BRAND
      ===================================================== */}

      <Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >

          <Restaurant
            sx={{
              color: "#12284a",
              fontSize: 32,
            }}
          />

          <Typography
            sx={{
              fontFamily: "Manrope",
              fontSize: "21px",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#12284a",
            }}
          >

            FOOD,{" "}

            <span
              style={{
                color: "#e58d9c",
              }}
            >
              Actually
            </span>

          </Typography>

        </Box>


        <Typography className="subtitle">

          Balanced meals • Everyday nutrition

        </Typography>

      </Box>


      <Box
        component="nav"
        aria-label="Main navigation"
        className="dashboard-nav"
      >
        <Button onClick={() => navigate("/")}>Home</Button>
        <Button onClick={() => navigate("/plans")}>Plans</Button>
        <Button onClick={() => document.querySelector(".how-it-works")?.scrollIntoView({ behavior: "smooth" })}>About</Button>
      </Box>


      {/* =====================================================
          USER SECTION
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >

        {isLoggedIn ? (

          <>

            {/* USER NAME */}

            <Box>

              <Typography
                sx={{
                  fontSize: "10px",
                  color: "#6a7280",
                  textAlign: "right",
                }}
              >
                Welcome back
              </Typography>


              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#12284a",
                  textAlign: "right",
                }}
              >

                {userName} 👋

              </Typography>

            </Box>


            {/* LOGOUT */}

            <Button
              startIcon={<Logout />}
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </Button>

          </>

        ) : (

          /* =================================================
             NOT LOGGED IN
             ================================================= */

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >

            {/* SIGN IN */}

            <Button
              startIcon={<Login />}
              onClick={() =>
                navigate("/login")
              }
              className="logout-btn"
            >
              Sign In
            </Button>


            {/* REGISTER */}

            <Button
              variant="contained"
              onClick={() =>
                navigate("/register")
              }
              sx={{
                background: "#12284a",
                color: "#fff",
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: 700,
                padding: "9px 18px",
                boxShadow:
                  "4px 4px 0 #e58d9c",

                "&:hover": {
                  background: "#e58d9c",
                  color: "#12284a",
                  boxShadow:
                    "2px 2px 0 #12284a",
                },
              }}
            >
              Register
            </Button>

          </Box>

        )}

      </Box>

    </div>

  );
};


export default Navbar;