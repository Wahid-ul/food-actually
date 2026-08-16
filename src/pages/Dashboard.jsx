import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";

import {
  ShoppingCart,
  Star,
  LocalOffer,
  Restaurant,
  Whatshot,
  Logout,
  Login,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import { getCurrentUser, logout } from "../utils/auth";
import DietitianProfile from "../assets/dietatian_profile_closeup.jpeg";


const Dashboard = () => {
  const navigate = useNavigate();

  // =========================================================
  // USER DATA
  // =========================================================

  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);

  const userName =
    currentUser?.name || localStorage.getItem("userName") || "Wahid";

  const [profileIndex, setProfileIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const profiles = [
    {
      name: "Shalini Goswami",
      role: "Dietitian & Nutritionist",
      bio: "Shalini Goswami is a wellness-focused dietitian helping people build healthier, more balanced routines through personalized nutrition guidance, sustainable eating habits, and science-backed lifestyle support.",
      image: DietitianProfile,
      href: "https://shalinigoswami.netlify.app/",
    },
    {
      name: userName,
      role: "Product & Technical Support",
      bio: "Contributes to Food, Actually by building the website and developing software tools that power this platform. Focused on creating seamless, user-friendly experiences that make healthy eating accessible and enjoyable for everyone.",
      image: null,
      href: null,
    },
  ];

  const goToNextProfile = () => {
    setProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  const goToPreviousProfile = () => {
    setProfileIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
  };

  const currentProfile = profiles[profileIndex];

  const points =
    Number(localStorage.getItem("points")) || 80;

  const saladsPurchased =
    Number(localStorage.getItem("saladsPurchased")) || 8;


  // =========================================================
  // SALAD DATA
  // =========================================================

  const salad = {
    name: "Paneer Salad",

    price: 199,

    originalPrice: 249,

    calories: 320,

    protein: "32g",

    carbs: "18g",

    fat: "12g",

    fiber: "6g",

    description:
      "Fresh vegetables, grilled paneer and a light dressing — a balanced vegetarian meal made for your everyday nutrition goals.",

    micronutrients:
      "Rich in protein, vitamin A, vitamin C, iron and potassium.",
  };


  // =========================================================
  // REWARD DATA
  // =========================================================

  const discount = 20;

  const discountedPrice =
    salad.price - (salad.price * discount) / 100;


  // =========================================================
  // REWARD PROGRESS
  // =========================================================

  const progress = points % 100;

  const pointsToNextReward =
    progress === 0 ? 0 : 100 - progress;


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };


  // =========================================================
  // BUY SALAD
  // =========================================================

  const handlePurchase = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const newPoints = points + 10;

    const newPurchaseCount =
      saladsPurchased + 1;


    localStorage.setItem(
      "points",
      newPoints.toString()
    );

    localStorage.setItem(
      "saladsPurchased",
      newPurchaseCount.toString()
    );


    alert(
      "🎉 Salad purchased successfully!\n\n+10 reward points added."
    );


    window.location.reload();
  };


  // =========================================================
  // ANIMATION
  // =========================================================

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  };


  return (
    <Box className="dashboard">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        className="dashboard-header"

        initial="hidden"

        animate="visible"

        variants={fadeUp}

        transition={{
          duration: 0.6,
        }}
      >

        {/* BRAND */}

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
                fontSize: "25px",
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

            Healthy meals • Smart rewards

          </Typography>

        </Box>


        {/* USER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {isLoggedIn ? (
            <>
              <Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#6a7280",
                    textAlign: "right",
                  }}
                >
                  Welcome back
                </Typography>

                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#12284a",
                    textAlign: "right",
                  }}
                >
                  {userName} 👋
                </Typography>
              </Box>

              <Button
                startIcon={<Logout />}
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                className="logout-btn"
              >
                Sign In
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  background: "#12284a",
                  color: "#fff",
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 700,
                  padding: "9px 18px",
                  boxShadow: "4px 4px 0 #e58d9c",
                  '&:hover': {
                    background: "#e58d9c",
                    color: "#12284a",
                    boxShadow: "2px 2px 0 #12284a",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>

      </motion.div>

    {/* =====================================================
            OPENING SALE BANNER
        ===================================================== */}

        {/*
        <motion.div
        initial={{
            opacity: 0,
            y: -25,
        }}
        animate={{
            opacity: 1,
            y: 0,
        }}
        transition={{
            duration: 0.7,
            delay: 0.2,
        }}
        >
        <Box className="opening-sale">

            <Box className="opening-sale-content">

            <Typography className="opening-sale-small">
                🎉 WE'RE OPEN!
            </Typography>

            <Typography className="opening-sale-title">
                OPENING SALE
            </Typography>

            <Typography className="opening-sale-discount">
                20% OFF
            </Typography>

            <Typography className="opening-sale-subtitle">
                YOUR FIRST BITE
            </Typography>

            <Typography className="opening-sale-description">
                Fresh • Protein-Rich • Delicious
            </Typography>

            </Box>

        </Box>
        </motion.div>
        */}


      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <Box className="dashboard-main">


        {/* ===================================================
            CHICKEN SALAD
        ==================================================== */}

        <motion.div

          initial={{
            opacity: 0,
            x: -35,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.7,
          }}
        >

          <Card className="salad-card">

            <CardContent>


              {/* BADGE */}

              <Chip
                label="NOW INTRODUCING • VEGETARIAN SALAD"
                size="small"
              />


              {/* TITLE */}

              <Typography className="salad-title">

                PANEER
                <br />

                SALAD
                <br />

                WITH A
                <br />
                TWIST

              </Typography>


              {/* DESCRIPTION */}

              <Typography className="salad-description">

                {salad.description}

              </Typography>



              {/* =================================================
                  NUTRITION
              ================================================== */}

              <Box className="nutrition-grid">


                {/* PROTEIN */}

                <Box className="nutrition-item protein">

                  <Typography className="nutrition-value">

                    {salad.protein}

                  </Typography>

                  <Typography className="nutrition-label">

                    Protein

                  </Typography>

                </Box>


                {/* CARBS */}

                <Box className="nutrition-item carbs">

                  <Typography className="nutrition-value">

                    {salad.carbs}

                  </Typography>

                  <Typography className="nutrition-label">

                    Carbs

                  </Typography>

                </Box>


                {/* FAT */}

                <Box className="nutrition-item fat">

                  <Typography className="nutrition-value">

                    {salad.fat}

                  </Typography>

                  <Typography className="nutrition-label">

                    Fat

                  </Typography>

                </Box>


                {/* FIBER */}

                <Box className="nutrition-item fiber">

                  <Typography className="nutrition-value">

                    {salad.fiber}

                  </Typography>

                  <Typography className="nutrition-label">

                    Fiber

                  </Typography>

                </Box>

              </Box>



              {/* DIVIDER */}

              <Divider
                sx={{
                  marginTop: 6,
                  marginBottom: 4,
                  borderColor: "#d9d2c8",
                }}
              />



              {/* CALORIES */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  marginBottom: 0,
                }}
              >

                <Whatshot
                  sx={{
                    color: "#e58d9c",
                    fontSize: 20,
                    marginRight: 6,
                  }}
                />

                <Typography className="calories">

                  {salad.calories} kcal

                </Typography>

              </Box>


              {/* MICRO NUTRIENTS */}

              <Typography className="micronutrients">

                {salad.micronutrients}

              </Typography>



              {/* =================================================
                  PRICE
              ================================================== */}

              <Box className="purchase-section">

                <Typography className="price-label">

                  Fresh meal price

                </Typography>


                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >

                  <Typography className="price">

                    ₹{salad.price}

                  </Typography>


                  <Typography
                    sx={{
                      color: "#8b919a",
                      textDecoration:
                        "line-through",
                      fontSize: "15px",
                    }}
                  >

                    ₹{salad.originalPrice}

                  </Typography>

                </Box>



                {/* BUY BUTTON */}

                <motion.div
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >

                  <Button
                    variant="contained"
                    startIcon={
                      <ShoppingCart />
                    }
                    onClick={handlePurchase}
                    className="buy-button"
                  >

                    Buy Salad

                  </Button>

                </motion.div>

              </Box>

            </CardContent>

          </Card>

        </motion.div>



        {/* ===================================================
            REWARDS
        ==================================================== */}

        <Box className="rewards-column">


          {/* =================================================
              REWARD POINTS
          ================================================= */}

          <motion.div

            initial={{
              opacity: 0,
              x: 35,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
          >

            <Card className="reward-card">

              <CardContent>


                {/* ICON + TITLE */}

                <Box className="card-heading">

                  <Box
                    className="icon-circle points-icon"
                  >

                    <Star />

                  </Box>


                  <Box>

                    <Typography className="reward-title">

                      Reward Points

                    </Typography>


                    <Typography
                      sx={{
                        color: "#6a7280",
                        fontSize: "12px",
                      }}
                    >

                      Your loyalty balance

                    </Typography>

                  </Box>

                </Box>



                {/* POINT NUMBER */}

                <Typography className="points-number">

                  {points}

                </Typography>


                <Typography className="reward-description">

                  +10 points for every salad purchase

                </Typography>



                {/* PROGRESS */}

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className="reward-progress"
                />


                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: 1,
                  }}
                >

                  <Typography className="progress-text">

                    {pointsToNextReward === 0
                      ? "Reward unlocked!"
                      : `${pointsToNextReward} points to next reward`}

                  </Typography>


                  <Typography
                    sx={{
                      color: "#12284a",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >

                    100

                  </Typography>

                </Box>

              </CardContent>

            </Card>

          </motion.div>



          {/* =================================================
              NEXT PURCHASE DISCOUNT
          ================================================= */}

          <motion.div

            initial={{
              opacity: 0,
              x: 35,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
          >

            <Card className="reward-card discount-card">

              <CardContent>


                {/* TITLE */}

                <Box className="card-heading">

                  <Box
                    className="icon-circle discount-icon"
                  >

                    <LocalOffer />

                  </Box>


                  <Box>

                    <Typography className="reward-title">

                      Next Purchase

                    </Typography>


                    <Typography
                      sx={{
                        color: "#6a7280",
                        fontSize: "12px",
                      }}
                    >

                      Your special offer

                    </Typography>

                  </Box>

                </Box>



                {/* DISCOUNT */}

                <Box className="discount-wrapper">

                  <Typography className="discount-number">

                    {discount}%

                  </Typography>


                  <Typography className="discount-off">

                    OFF

                  </Typography>

                </Box>



                <Typography className="reward-description">

                  Your discount will automatically
                  be applied to your next salad order.

                </Typography>



                {/* NEXT PRICE */}

                <Box
                  sx={{
                    marginTop: 18,
                    padding: "14px 16px",
                    borderRadius: "18px",
                    background: "#dce9f3",
                    border:
                      "1.5px solid #12284a",
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#657080",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >

                    Next salad price

                  </Typography>


                  <Typography
                    sx={{
                      fontFamily: "Manrope",
                      fontSize: "23px",
                      fontWeight: 800,
                      color: "#12284a",
                    }}
                  >

                    ₹{discountedPrice}

                  </Typography>

                </Box>

              </CardContent>

            </Card>

          </motion.div>

        </Box>

      </Box>


      {/* =====================================================
          NUTRITION INFORMATION
      ===================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}

      >

        <Typography className="section-title" sx={{ marginTop: '20px', marginBottom: '6px' }}>

          Nutrition Information

        </Typography>


        <Card className="nutrition-section">

          <CardContent sx={{ padding: '12px 16px' }}>


            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "20px",
                fontWeight: 800,
                color: "#12284a",
                marginBottom: 6,
              }}
            >

              Macronutrients

            </Typography>



            <Box className="macro-grid">


              <Box>

                <Typography className="macro-value">

                  320

                </Typography>

                <Typography className="macro-label">

                  Calories

                </Typography>

              </Box>


              <Box>

                <Typography className="macro-value">

                  32g

                </Typography>

                <Typography className="macro-label">

                  Protein

                </Typography>

              </Box>


              <Box>

                <Typography className="macro-value">

                  18g

                </Typography>

                <Typography className="macro-label">

                  Carbohydrates

                </Typography>

              </Box>


              <Box>

                <Typography className="macro-value">

                  12g

                </Typography>

                <Typography className="macro-label">

                  Fat

                </Typography>

              </Box>


              <Box>

                <Typography className="macro-value">

                  6g

                </Typography>

                <Typography className="macro-label">

                  Fiber

                </Typography>

              </Box>

            </Box>



            <Divider
              sx={{
                marginTop: 8,
                marginBottom: 6,
                borderColor:
                  "rgba(18,40,74,0.2)",
              }}
            />



            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "20px",
                fontWeight: 800,
                color: "#12284a",
                marginBottom: 6,
              }}
            >

              Vitamins & Minerals

            </Typography>



            <Box className="vitamin-grid">

              <Chip
                label="Vitamin A • 35% DV"
                className="vitamin-chip"
              />

              <Chip
                label="Vitamin C • 28% DV"
                className="vitamin-chip"
              />

              <Chip
                label="Iron • 15% DV"
                className="vitamin-chip"
              />

              <Chip
                label="Potassium • 12% DV"
                className="vitamin-chip"
              />

            </Box>

          </CardContent>

        </Card>

      </motion.div>



      {/* =====================================================
          PEOPLE BEHIND THIS
      ===================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}

      >

        <Typography className="section-title">

          People behind this

        </Typography>


        <Card
          sx={{
            maxWidth: "1280px",
            margin: "0 auto",
            borderRadius: "28px",
            background: "#fffaf3",
            border: "1.5px solid #12284a",
            boxShadow: "7px 7px 0 #e7b5bc",
          }}
        >
          <CardContent
            sx={{
              padding: "22px",
              '@media (max-width: 700px)': {
                padding: "16px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                marginBottom: 2,
                '@media (max-width: 700px)': {
                  marginBottom: 1.5,
                },
              }}
            >
              <Button
                variant="outlined"
                onClick={goToPreviousProfile}
                sx={{
                  minWidth: "40px",
                  width: "40px",
                  height: "40px",
                  borderColor: "#12284a",
                  color: "#12284a",
                  borderRadius: "50%",
                  padding: 0,
                  '@media (max-width: 700px)': {
                    minWidth: "34px",
                    width: "34px",
                    height: "34px",
                  },
                }}
              >
                <ChevronLeft />
              </Button>

              <Button
                variant="outlined"
                onClick={goToNextProfile}
                sx={{
                  minWidth: "40px",
                  width: "40px",
                  height: "40px",
                  borderColor: "#12284a",
                  color: "#12284a",
                  borderRadius: "50%",
                  padding: 0,
                  '@media (max-width: 700px)': {
                    minWidth: "34px",
                    width: "34px",
                    height: "34px",
                  },
                }}
              >
                <ChevronRight />
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                minHeight: 260,
                '@media (max-width: 700px)': {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                  minHeight: 0,
                },
              }}
              onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
              onTouchEnd={(event) => {
                const delta = event.changedTouches[0].clientX - touchStartX;

                if (delta > 40) {
                  goToPreviousProfile();
                } else if (delta < -40) {
                  goToNextProfile();
                }
              }}
            >
              {currentProfile.image ? (
                <Box
                  component={currentProfile.href ? "a" : "div"}
                  href={currentProfile.href || undefined}
                  target={currentProfile.href ? "_blank" : undefined}
                  rel={currentProfile.href ? "noopener noreferrer" : undefined}
                  sx={{
                    display: "block",
                    flexShrink: 0,
                    textDecoration: "none",
                    '@media (max-width: 700px)': {
                      width: "100%",
                    },
                  }}
                >
                  <img
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    style={{
                      width: 220,
                      height: 220,
                      objectFit: "cover",
                      borderRadius: "22px",
                      border: "2px solid #12284a",
                      display: "block",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: 220,
                    height: 220,
                    borderRadius: "22px",
                    border: "2px solid #12284a",
                    background: "linear-gradient(135deg, #e58d9c 0%, #dce9f3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Manrope",
                    fontWeight: 800,
                    fontSize: "68px",
                    color: "#12284a",
                    flexShrink: 0,
                    '@media (max-width: 700px)': {
                      width: 150,
                      height: 150,
                      fontSize: "46px",
                    },
                  }}
                >
                  {userName.slice(0, 2).toUpperCase()}
                </Box>
              )}

              <Box sx={{ flex: 1, '@media (max-width: 700px)': { width: '100%' } }}>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#12284a",
                    marginBottom: "4px",
                    '@media (max-width: 700px)': {
                      fontSize: "22px",
                    },
                  }}
                >
                  {currentProfile.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#e58d9c",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    '@media (max-width: 700px)': {
                      fontSize: "12px",
                    },
                  }}
                >
                  {currentProfile.role}
                </Typography>

                <Typography
                  sx={{
                    color: "#4e5969",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    marginBottom: "12px",
                    '@media (max-width: 700px)': {
                      fontSize: "14px",
                      lineHeight: 1.6,
                    },
                  }}
                >
                  {currentProfile.bio}
                </Typography>

                {currentProfile.href ? (
                  <Typography
                    component="a"
                    href={currentProfile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-block",
                      fontWeight: 700,
                      color: "#12284a",
                      textDecoration: "underline",
                      '@media (max-width: 700px)': {
                        fontSize: "14px",
                      },
                    }}
                  >
                    View profile
                  </Typography>
                ) : null}
              </Box>
            </Box>
          </CardContent>
        </Card>

      </motion.div>



      {/* =====================================================
          RECENT PURCHASES
      ===================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}

      >

        <Typography className="section-title">

          Recent Purchases

        </Typography>



        <Card className="purchase-history">

          <CardContent>


            {/* PURCHASE 1 */}

            <Box className="purchase-row">

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >

                <Box className="purchase-icon">

                  🥗

                </Box>


                <Box>

                  <Typography
                    sx={{
                      color: "#12284a",
                      fontWeight: 700,
                    }}
                  >

                    Grilled Chicken Salad

                  </Typography>


                  <Typography
                    sx={{
                      color: "#737b87",
                      fontSize: "12px",
                    }}
                  >

                    Today

                  </Typography>

                </Box>

              </Box>


              <Box
                sx={{
                  textAlign: "right",
                }}
              >

                <Typography
                  sx={{
                    color: "#12284a",
                    fontWeight: 700,
                  }}
                >

                  ₹199

                </Typography>


                <Typography
                  sx={{
                    color: "#6f9362",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >

                  +10 points

                </Typography>

              </Box>

            </Box>



            {/* PURCHASE 2 */}

            <Box className="purchase-row">

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >

                <Box className="purchase-icon">

                  🥗

                </Box>


                <Box>

                  <Typography
                    sx={{
                      color: "#12284a",
                      fontWeight: 700,
                    }}
                  >

                    Grilled Chicken Salad

                  </Typography>


                  <Typography
                    sx={{
                      color: "#737b87",
                      fontSize: "12px",
                    }}
                  >

                    Aug 08

                  </Typography>

                </Box>

              </Box>


              <Box
                sx={{
                  textAlign: "right",
                }}
              >

                <Typography
                  sx={{
                    color: "#12284a",
                    fontWeight: 700,
                  }}
                >

                  ₹159

                </Typography>


                <Typography
                  sx={{
                    color: "#6f9362",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >

                  +10 points

                </Typography>

              </Box>

            </Box>



            {/* PURCHASE 3 */}

            <Box className="purchase-row">

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >

                <Box className="purchase-icon">

                  🥗

                </Box>


                <Box>

                  <Typography
                    sx={{
                      color: "#12284a",
                      fontWeight: 700,
                    }}
                  >

                    Grilled Chicken Salad

                  </Typography>


                  <Typography
                    sx={{
                      color: "#737b87",
                      fontSize: "12px",
                    }}
                  >

                    Aug 05

                  </Typography>

                </Box>

              </Box>


              <Box
                sx={{
                  textAlign: "right",
                }}
              >

                <Typography
                  sx={{
                    color: "#12284a",
                    fontWeight: 700,
                  }}
                >

                  ₹199

                </Typography>


                <Typography
                  sx={{
                    color: "#6f9362",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >

                  +10 points

                </Typography>

              </Box>

            </Box>

          </CardContent>

        </Card>

      </motion.div>



      {/* =====================================================
          FOOTER BRAND MESSAGE
      ===================================================== */}

      <motion.div

        initial={{
          opacity: 0,
        }}

        whileInView={{
          opacity: 1,
        }}

        viewport={{
          once: true,
        }}

        transition={{
          duration: 0.8,
        }}

        style={{
          position: "relative",
          zIndex: 2,
        }}
      >

        <Box className="footer-brand"
          sx={{
            maxWidth: "1280px",
            margin: "70px auto 0",
            padding: "40px",
            borderTop:
              "1.5px solid #12284a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >

          <Box>

            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "28px",
                fontWeight: 800,
                color: "#12284a",
              }}
            >

              EAT WELL.

            </Typography>


            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "28px",
                fontWeight: 800,
                color: "#e58d9c",
              }}
            >

              FEEL BETTER.

            </Typography>


            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "28px",
                fontWeight: 800,
                color: "#12284a",
              }}
            >

              LIVE MORE.

            </Typography>

          </Box>




        </Box>

      </motion.div>

    </Box>
  );
};


export default Dashboard;