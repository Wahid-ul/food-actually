import React from "react";
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
  TrendingUp,
} from "@mui/icons-material";

import DietitianProfile from "../assets/Dietatian_Profile.jpeg";


const Dashboard = () => {
  const navigate = useNavigate();

  // =========================================================
  // USER DATA
  // =========================================================

  const userName =
    localStorage.getItem("userName") || "Wahid";

  const points =
    Number(localStorage.getItem("points")) || 80;

  const saladsPurchased =
    Number(localStorage.getItem("saladsPurchased")) || 8;


  // =========================================================
  // SALAD DATA
  // =========================================================

  const salad = {
    name: "Grilled Chicken Salad",

    price: 199,

    originalPrice: 249,

    calories: 320,

    protein: "32g",

    carbs: "18g",

    fat: "12g",

    fiber: "6g",

    description:
      "Fresh vegetables, grilled chicken and a light dressing — a balanced meal made for your everyday nutrition goals.",

    micronutrients:
      "Rich in lean protein, vitamin A, vitamin C, iron and potassium.",
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

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");

    navigate("/login");
  };


  // =========================================================
  // BUY SALAD
  // =========================================================

  const handlePurchase = () => {

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
            gap: 8,
          }}
        >

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

        </Box>

      </motion.div>

    {/* =====================================================
            OPENING SALE BANNER
        ===================================================== */}

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
                label="SCIENCE-BACKED • HIGH PROTEIN"
                size="small"
              />


              {/* TITLE */}

              <Typography className="salad-title">

                CHICKEN
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
          YOUR PROGRESS
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

          Your Profile

        </Typography>


        <Box className="stats-grid">


          {/* SALADS */}

          <Card className="stat-card">

            <Restaurant className="stat-icon" />


            <Typography className="stat-number">

              {saladsPurchased}

            </Typography>


            <Typography className="stat-label">

              Salads Purchased

            </Typography>

          </Card>



          {/* POINTS */}

          <Card className="stat-card">

            <Star className="stat-icon" />


            <Typography className="stat-number">

              {points}

            </Typography>


            <Typography className="stat-label">

              Reward Points

            </Typography>

          </Card>



          {/* NEXT PRICE */}

          <Card className="stat-card">

            <TrendingUp className="stat-icon" />


            <Typography className="stat-number">

              ₹{discountedPrice}

            </Typography>


            <Typography className="stat-label">

              Next Salad Price

            </Typography>

          </Card>

        </Box>

      </motion.div>



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


          <Box
            sx={{
              maxWidth: 400,
              textAlign: "right",
            }}
          >

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "13px", color: "#667181", marginBottom: 0.5 }}>
                  Meet our dietitian
                </Typography>

                <Box component="a" href="https://shalinigoswami.netlify.app/" target="_blank" rel="noopener noreferrer" sx={{ display: "inline-block", textDecoration: "none" }}>
                  <img
                    src={DietitianProfile}
                    alt="Shallini Goswami"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #12284a",
                      display: "block",
                    }}
                  />
                </Box>

                <Box>
                  <Typography component="a" href="https://shalinigoswami.netlify.app/" target="_blank" rel="noopener noreferrer" sx={{ display: "block", marginTop: 0.5, fontSize: "13px", color: "#12284a", textDecoration: "underline", fontWeight: 600 }}>
                    Shallini Goswami | Nutritionist
                  </Typography>
                </Box>
              </Box>
            </Box>

          </Box>

        </Box>

      </motion.div>

    </Box>
  );
};


export default Dashboard;