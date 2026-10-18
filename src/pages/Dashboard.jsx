import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import {
  ShoppingCart,
  Restaurant,
  Whatshot,
  ChevronLeft,
  ChevronRight,
  ExpandMore,
} from "@mui/icons-material";

import { getCurrentUser } from "../utils/auth";
import DietitianProfile from "../assets/dietatian_profile_closeup.jpeg";
import WahidProfile from "../assets/Wahid_profile.jpeg";
import PaneerSaladImage from "../assets/menu/paneer-salad.png";
import GrilledChickenSaladImage from "../assets/menu/grilled-chicken-salad.png";
import MilletBowlImage from "../assets/menu/millet-protein-bowl.png";
import EggBowlImage from "../assets/menu/egg-protein-bowl.png";
import ChickpeaBowlImage from "../assets/menu/chickpea-power-bowl.png";
import PaymentModal from "../components/PaymentModal";
import Navbar from "../pages/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  // =========================================================
  // USER DATA
  // =========================================================

  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);

  const userName =
    currentUser?.name ||
    localStorage.getItem("userName") ||
    "Wahid";

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [heroSlide, setHeroSlide] = useState(0);
  const isMobileLayout = useMediaQuery("(max-width: 750px)");
  const howItWorksRef = useRef(null);
  const { scrollYProgress: howItWorksProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "start center"],
  });
  const bowlDrop = useTransform(howItWorksProgress, [0, 1], ["-70vh", "0vh"]);
  const bowlY = useSpring(bowlDrop, { stiffness: 85, damping: 24, mass: 0.8 });
  const bowlOpacity = useTransform(howItWorksProgress, [0, 0.65, 1], [0, 0.82, 1]);
  const bowlScale = useTransform(howItWorksProgress, [0, 1], [0.76, 1]);
  const bowlRotation = useTransform(howItWorksProgress, [0, 1], [-9, 0]);

  // Freeze the bowl once it has fully landed so scrolling back up and
  // down doesn't re-trigger the drop animation (keeping behaviour consistent).
  const bowlHasLanded = useRef(false);
  useMotionValueEvent(howItWorksProgress, "change", (latest) => {
    if (!bowlHasLanded.current && latest >= 0.95) {
      bowlHasLanded.current = true;
      // Snap motion values to their final resting state and stop updating them.
      bowlDrop.jump("0vh");
      bowlOpacity.jump(1);
      bowlScale.jump(1);
      bowlRotation.jump(0);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  // =========================================================
  // PEOPLE / PROFILE DATA
  // =========================================================

  const profiles = [
    {
      name: "Shalini Goswami",

      bio:
        "Creates healthy new recipes and prepares your plates.",

      image: DietitianProfile,

      href: "https://shalinigoswami.netlify.app/",
    },

    {
      name: "Wahidul Alam",

      bio:
        "Management of delivery and execution.",

      image: WahidProfile,

      href: null,
    },
  ];


  // =========================================================
  // USER PURCHASE DATA
  // =========================================================

  const points =
    Number(localStorage.getItem("points")) || 80;

  const saladsPurchased =
    Number(
      localStorage.getItem("saladsPurchased")
    ) || 8;


  // =========================================================
  // MENU DATA
  // =========================================================

  const menuItems = [
    {
      name: "Paneer Salad",

      image: PaneerSaladImage,

      badge:
        "NOW INTRODUCING • VEGETARIAN SALAD",

      price: 269,

      originalPrice: 269,

      calories: 410,

      protein: "30g",

      carbs: "55g",

      fat: "8g",

      fiber: "6g",

      description:
        "Fresh vegetables, grilled paneer and a light dressing — a balanced vegetarian meal made for your everyday nutrition goals.",

      micronutrients:
        "Rich in protein, vitamin A, vitamin C, iron and potassium.",
    },

    {
      name: "Grilled Chicken Salad",

      image: GrilledChickenSaladImage,

      badge:
        "HIGH PROTEIN • CUSTOMER FAVORITE",

      price: 299,

      originalPrice: 329,

      calories: 360,

      protein: "34g",

      carbs: "22g",

      fat: "11g",

      fiber: "7g",

      description:
        "Fresh vegetables, grilled chicken and a light dressing — a high-protein meal designed for your everyday nutrition goals.",

      micronutrients:
        "Rich in protein, vitamin B6, vitamin C, iron and potassium.",
    },

    {
      name: "Millet Protein Bowl",

      image: MilletBowlImage,

      badge:
        "WHOLEGRAIN • HIGH FIBER",

      price: 249,

      originalPrice: 279,

      calories: 390,

      protein: "24g",

      carbs: "48g",

      fat: "10g",

      fiber: "9g",

      description:
        "Wholesome millet, fresh vegetables and protein-packed ingredients combined into a satisfying balanced meal.",

      micronutrients:
        "Rich in magnesium, iron, vitamin B6 and potassium.",
    },

    {
      name: "Egg Protein Bowl",

      image: EggBowlImage,

      badge:
        "HIGH PROTEIN • BALANCED MEAL",

      price: 229,

      originalPrice: 259,

      calories: 350,

      protein: "27g",

      carbs: "28g",

      fat: "12g",

      fiber: "6g",

      description:
        "Fresh vegetables, boiled eggs and wholesome grains combined for a delicious protein-rich everyday meal.",

      micronutrients:
        "Rich in vitamin B12, vitamin D, selenium, iron and potassium.",
    },

    {
      name: "Chickpea Power Bowl",

      image: ChickpeaBowlImage,

      badge:
        "PLANT PROTEIN • HIGH FIBER",

      price: 219,

      originalPrice: 249,

      calories: 380,

      protein: "21g",

      carbs: "52g",

      fat: "9g",

      fiber: "11g",

      description:
        "Protein-rich chickpeas, fresh vegetables and wholesome grains for a filling plant-based meal.",

      micronutrients:
        "Rich in folate, iron, magnesium, potassium and vitamin C.",
    },
  ];

  const mealPriceMinimum = Math.min(...menuItems.map((item) => item.price));
  const mealPriceMaximum = Math.max(...menuItems.map((item) => item.price));
  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  const estimatePlanPrice = (days, mealsPerDay) => {
    const servings = days * mealsPerDay;
    return `${formatPrice(mealPriceMinimum * servings)} – ${formatPrice(mealPriceMaximum * servings)}`;
  };
  const subscriptionPlans = [
    {
      title: "Weekly plan",
      term: "7 DAYS",
      days: 7,
      description: "Try a week of ready-to-enjoy meals and build an easier routine.",
    },
    {
      title: "One month plan",
      term: "30 DAYS",
      days: 30,
      description: "Keep lunch, dinner, or both covered throughout the month.",
    },
    {
      title: "Three month plan",
      term: "90 DAYS",
      days: 90,
      description: "Plan further ahead with a longer run of convenient meal choices.",
    },
  ];
  const dietPlans = [
    {
      title: "Gym training",
      focus: "HIGH PROTEIN + HIGH FIBER",
      description: "Explore satisfying meal choices with protein-rich ingredients and fiber variety for training-focused routines.",
    },
    {
      title: "Keto-style",
      focus: "LOWER-CARB PREFERENCES",
      description: "Discuss a very-low-carb approach with a qualified professional before changing your eating pattern.",
    },
    {
      title: "Weight loss",
      focus: "BALANCED EVERYDAY HABITS",
      description: "Explore a consistent, balanced meal pattern around your preferences and daily schedule.",
    },
    {
      title: "Muscle gain",
      focus: "TRAINING + NUTRITION",
      description: "Explore meal choices that support your training routine, with energy and protein needs tailored to you.",
    },
  ];


  // =========================================================
  // DIET CONSULTATION PLANS DATA
  // =========================================================

  const dietConsultPlans = [
    {
      name: "Starter consult",
      price: "₹499",
      summary:
        "A single focused session to point your eating habits in the right direction.",
      features: [
        "One 45-minute consultation",
        "Review of your current eating habits",
        "Simple starting recommendations",
        "Session notes shared with you",
      ],
    },
    {
      name: "Monthly guidance",
      price: "₹1,499",
      summary:
        "Ongoing support while you build a routine that actually sticks.",
      features: [
        "Two consultations during the month",
        "A personalized meal framework",
        "Weekly progress check-ins",
        "Message support for quick questions",
      ],
    },
    {
      name: "Quarterly program",
      price: "₹3,999",
      summary:
        "Longer-term partnership for bigger health and fitness goals.",
      features: [
        "Six consultations over three months",
        "Plan updated as your progress evolves",
        "Priority scheduling and support",
        "Progress reviews with clear next steps",
      ],
    },
  ];


  // =========================================================
  // FAQ DATA
  // =========================================================

  const faqs = [
    {
      question: "How do I order a meal?",
      answer:
        "Browse the menu, pick the dish you like, and choose 'Choose this meal'. You will need an account — then you can pay securely and we prepare your order fresh.",
    },
    {
      question: "Do you deliver the meals?",
      answer:
        "Yes — prepared meals can be delivered to your home or workplace. Delivery details and any applicable charges are shared with your order confirmation.",
    },
    {
      question: "How do the meal subscription plans work?",
      answer:
        "Choose a 7-day, 30-day or 90-day plan covering lunch, dinner, or both. Pricing estimates use current menu prices, and your final total depends on the dishes you select.",
    },
    {
      question: "Can I get meals for specific dietary preferences?",
      answer:
        "The menu includes vegetarian, high-protein and plant-forward options. For more specific needs, our nutritionist can help you choose meals that fit your goals.",
    },
    {
      question: "How do reward points work?",
      answer:
        "You earn 10 reward points every time you purchase a meal. Points are added to your account automatically after a successful payment.",
    },
    {
      question: "Can I talk to a nutritionist before ordering?",
      answer:
        "Absolutely. You can book a consultation with our dietitian Shalini Goswami through the diet consultation plans or the diet plan starting points on this page.",
    },
  ];


  // =========================================================
  // SELECTED MENU ITEM
  // =========================================================

  const [selectedSalad, setSelectedSalad] =
    useState(menuItems[0]);


  // =========================================================


  // =========================================================
  // BUY SALAD
  // =========================================================

  const handlePurchase = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setPaymentModalOpen(true);
  };


  // =========================================================
  // PAYMENT SUCCESS
  // =========================================================

  const handlePaymentSuccess = () => {
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


    setPaymentModalOpen(false);


    alert(
      "🎉 Payment successful!\n\n+10 reward points added."
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
        NAVBAR
      ===================================================== */}

      <div
        className="dashboard-header-shell"
      >

        <Navbar
          isLoggedIn={isLoggedIn}
          userName={userName}
        />

      </div>

      


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
          <Box className={`opening-sale opening-sale-${["pink", "blue", "sage"][heroSlide]}`}>

            {/* =====================================================
                HERO SLIDE 1
            ===================================================== */}

            {heroSlide === 0 && (
              <motion.div
                key="slide-1"

                initial={{
                  opacity: 0,
                  x: 50,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                exit={{
                  opacity: 0,
                  x: -50,
                }}

                transition={{
                  duration: 0.5,
                }}

                className="opening-sale-slide"
              >

                {/* LEFT SIDE */}

                <Box className="opening-sale-content">

                  <Typography className="opening-sale-small opening-sale-plan-kicker">
                    MEAL SUBSCRIPTIONS, MADE SIMPLE
                  </Typography>

                  <Typography className="opening-sale-title opening-sale-plan-title">
                    MEAL PLANS.
                    <br />
                    MADE FOR YOU.
                  </Typography>

                  <Typography className="opening-sale-discount opening-sale-plan-highlight">
                    LESS DAILY PLANNING
                  </Typography>

                  <Typography className="opening-sale-subtitle opening-sale-plan-subtitle">
                    MORE TIME TO ENJOY
                  </Typography>

                  <Typography className="opening-sale-description opening-sale-plan-description">
                    Choose a weekly, monthly, or three-month plan with meals to fit your routine.
                  </Typography>

                  <Box className="opening-sale-code opening-sale-plan-callout">
                    LUNCH • DINNER • OR BOTH
                  </Box>

                  <Button
                    component="a"
                    href="#meal-plans"
                    className="opening-sale-cta"
                  >
                    Compare meal plans
                  </Button>

                  <Typography className="opening-sale-terms opening-sale-plan-terms">
                    Choose from available meal options and view plan pricing.
                  </Typography>

                </Box>


                {/* RIGHT SIDE */}

                <Box className="opening-sale-image">

                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                    alt="Healthy meal"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />

                </Box>

              </motion.div>
            )}


            {/* =====================================================
                HERO SLIDE 2
            ===================================================== */}

            {heroSlide === 1 && (
              <motion.div
                key="slide-2"

                initial={{
                  opacity: 0,
                  x: 50,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                exit={{
                  opacity: 0,
                  x: -50,
                }}

                transition={{
                  duration: 0.5,
                }}

                className="opening-sale-slide"
              >

                {/* LEFT SIDE */}

                <Box className="opening-sale-content">

                  <Typography className="opening-sale-small">
                    YOUR GOALS. YOUR FOOD PLAN.
                  </Typography>

                  <Typography className="opening-sale-title">
                    A PLAN THAT
                    <br />
                    FITS YOU.
                  </Typography>

                  <Typography className="opening-sale-discount">
                    PICK YOUR PATH
                  </Typography>

                  <Typography className="opening-sale-subtitle">
                    GYM • KETO-STYLE • MORE
                  </Typography>

                  <Typography className="opening-sale-description">
                    Explore starting points for training, weight management, or muscle gain.
                  </Typography>

                  <Box className="opening-sale-code">
                    MAKE YOUR MEALS WORK FOR YOUR GOALS
                  </Box>

                  <Button
                    component="a"
                    href="#diet-plans"
                    className="opening-sale-cta"
                  >
                    Explore diet plans
                  </Button>

                  <Typography className="opening-sale-terms">
                    For personalized advice, connect with our nutritionist.
                  </Typography>

                </Box>


                {/* RIGHT SIDE */}

                <Box className="opening-sale-image">

                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
                    alt="Fresh healthy salad"
                    loading="lazy"
                    decoding="async"
                  />

                </Box>

              </motion.div>
            )}


            {/* =====================================================
                HERO SLIDE 3
            ===================================================== */}

            {heroSlide === 2 && (
              <motion.div
                key="slide-3"

                initial={{
                  opacity: 0,
                  x: 50,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                exit={{
                  opacity: 0,
                  x: -50,
                }}

                transition={{
                  duration: 0.5,
                }}

                className="opening-sale-slide"
              >

                {/* LEFT SIDE */}

                <Box className="opening-sale-content">

                  <Typography className="opening-sale-small">
                    MEALS FOR YOUR SCHEDULE
                  </Typography>

                  <Typography className="opening-sale-title">
                    FRESH MEALS.
                    <br />
                    ON YOUR SCHEDULE.
                  </Typography>

                  <Typography className="opening-sale-discount">
                    CHOOSE • EAT • ENJOY
                  </Typography>

                  <Typography className="opening-sale-subtitle">
                    MAKE IT YOUR ROUTINE
                  </Typography>

                  <Typography className="opening-sale-description">
                    Convenient meal choices when your day gets busy.
                  </Typography>

                  <Box className="opening-sale-code">
                    YOUR ROUTINE, YOUR WAY
                  </Box>

                  <Button
                    className="opening-sale-cta"
                    onClick={() => document.querySelector(".meal-plans")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    See meal options
                  </Button>

                  <Typography className="opening-sale-terms">
                    Start with a single meal, then return whenever you need another.
                  </Typography>

                </Box>


                {/* RIGHT SIDE */}

                <Box className="opening-sale-image">

                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1000&q=80"
                    alt="Healthy food"
                    loading="lazy"
                    decoding="async"
                  />

                </Box>

              </motion.div>
            )}


            {/* =====================================================
                SLIDE DOTS
            ===================================================== */}

            <Box className="opening-sale-dots">

              {[0, 1, 2].map((index) => (

                <Box
                  key={index}

                  onClick={() =>
                    setHeroSlide(index)
                  }

                  className={
                    heroSlide === index
                      ? "opening-sale-dot active"
                      : "opening-sale-dot"
                  }
                />

              ))}

            </Box>


            {/* =====================================================
                LEFT / RIGHT ARROWS
            ===================================================== */}

            <Button
              className="opening-sale-prev"
              onClick={() =>
                setHeroSlide(
                  (prev) =>
                    (prev - 1 + 3) % 3
                )
              }
            >
              <ChevronLeft />
            </Button>


            <Button
              className="opening-sale-next"
              onClick={() =>
                setHeroSlide(
                  (prev) =>
                    (prev + 1) % 3
                )
              }
            >
              <ChevronRight />
            </Button>

          </Box>
        </motion.div>


      {/* =====================================================
          SERVICE BENEFITS
      ===================================================== */}

      <Box className="benefit-strip" aria-label="Meal service benefits">
        <Box className="benefit-item">
          <Typography className="benefit-title">Meal choices for your routine</Typography>
          <Typography className="benefit-copy">Pick a dish for today and come back whenever you need another.</Typography>
        </Box>
        <Box className="benefit-item">
          <Typography className="benefit-title">Nutritionist guidance</Typography>
          <Typography className="benefit-copy">Get thoughtful support for your food goals.</Typography>
        </Box>
        <Box className="benefit-item">
          <Typography className="benefit-title">Delivered to you</Typography>
          <Typography className="benefit-copy">Enjoy prepared meals at home or work.</Typography>
        </Box>
      </Box>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <motion.div
        ref={howItWorksRef}
        className="how-it-works"
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <Box className="how-heading">
          <Typography className="section-kicker">HOW IT WORKS</Typography>
          <Typography className="how-title">A simpler way to eat well</Typography>
          <Typography className="how-description">A few easy steps from choosing your meals to making them part of your day.</Typography>
        </Box>
        <Box className="steps-stage">
          <motion.svg
            className="step-connectors"
            viewBox="0 0 1120 414"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker id="step-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0 0 8 4 0 8Z" fill="#12284a" />
              </marker>
            </defs>
            <motion.path d="M270 48 Q355 48 451 82" markerEnd="url(#step-arrow)" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.25, delay: 0.55, ease: "easeOut" } } }} />
            <motion.path d="M270 298 Q350 294 420 290" markerEnd="url(#step-arrow)" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.25, delay: 0.72, ease: "easeOut" } } }} />
            <motion.path d="M850 84 Q770 84 674 82" markerEnd="url(#step-arrow)" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.25, delay: 0.55, ease: "easeOut" } } }} />
            <motion.path d="M850 358 Q780 358 700 290" markerEnd="url(#step-arrow)" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.25, delay: 0.72, ease: "easeOut" } } }} />
          </motion.svg>
          <motion.svg
            className="step-connectors step-connectors-mobile"
            viewBox="0 0 350 540"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path d="M85 117 C86 140 93 159 101 178" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.2, delay: 0.72, ease: [0.22, 1, 0.3, 1] } } }} />
            <motion.path d="M265 114 C264 138 256 158 249 178" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.2, delay: 0.84, ease: [0.22, 1, 0.3, 1] } } }} />
            <motion.path d="M85 387 C87 365 94 344 101 326" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.2, delay: 0.96, ease: [0.22, 1, 0.3, 1] } } }} />
            <motion.path d="M265 387 C263 365 256 344 249 326" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.68, transition: { duration: 1.2, delay: 1.08, ease: [0.22, 1, 0.3, 1] } } }} />
          </motion.svg>
          <Box className="step-position step-explore">
            <motion.div
              className="step-card step-card-clickable"
              variants={{
                hidden: { opacity: 0, x: 130 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.35, delay: 0.28, ease: [0.16, 1, 0.3, 1] } },
              }}
              onClick={() => document.querySelector(".menu-scroll")?.scrollIntoView({ behavior: "smooth" })}
              style={{ cursor: "pointer" }}
            >
              <Typography className="step-number">01</Typography>
              <Typography className="step-title">Explore the menu</Typography>
              <Typography className="step-copy">Browse meal choices, ingredients, and nutrition details.</Typography>
              <Typography className="step-cta-hint">View menu ↓</Typography>
            </motion.div>
          </Box>
          <Box className="step-position step-choose">
            <motion.div
              className="step-card step-card-clickable"
              variants={{
                hidden: { opacity: 0, x: isMobileLayout ? -130 : 130 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.4, delay: 0.38, ease: [0.16, 1, 0.3, 1] } },
              }}
              onClick={() => document.getElementById("diet-plans")?.scrollIntoView({ behavior: "smooth" })}
              style={{ cursor: "pointer" }}
            >
              <Typography className="step-number">02</Typography>
              <Typography className="step-title">Choose your dish</Typography>
              <Typography className="step-copy">Pick the meal that suits your taste and everyday routine.</Typography>
              <Typography className="step-cta-hint">See diet plans ↓</Typography>
            </motion.div>
          </Box>
          <motion.div
            className="plate-illustration"
            style={{ y: bowlY, opacity: bowlOpacity, scale: bowlScale, rotate: bowlRotation }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"
              alt="A colorful, freshly prepared meal served in a bowl"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
          <Box className="step-position step-daily">
            <motion.div
              className="step-card"
              variants={{
                hidden: { opacity: 0, x: -130 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.35, delay: 0.28, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <Typography className="step-number">04</Typography>
              <Typography className="step-title">Make it part of daily life</Typography>
              <Typography className="step-copy">Enjoy convenient meals that make eating well easier day to day.</Typography>
            </motion.div>
          </Box>
          <Box className="step-position step-questionnaire">
            <motion.div
              className="step-card step-card-clickable"
              variants={{
                hidden: { opacity: 0, x: isMobileLayout ? 130 : -130 },
                visible: { opacity: 1, x: 0, transition: { duration: 1.4, delay: 0.38, ease: [0.16, 1, 0.3, 1] } },
              }}
              onClick={() => navigate("/questionnaire")}
              style={{ cursor: "pointer" }}
            >
              <Typography className="step-number">03</Typography>
              <Typography className="step-title">Fill out the questionnaire form</Typography>
              <Typography className="step-copy">Share your goals and food preferences so we can understand what works for you.</Typography>
              <Typography className="step-cta-hint">Start form →</Typography>
            </motion.div>
          </Box>
        </Box>
      </motion.div>


      {/* =====================================================
          OUR MENU
      ===================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.7,
        }}
      >

        <Typography
          className="section-title menu-section-title"
          sx={{
            marginBottom: "8px",
          }}
        >
          A menu for every day
        </Typography>


        <Typography
          sx={{
            color: "#667181",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          Discover satisfying, freshly prepared meals—from plant-forward bowls to protein-rich favourites. Pick a dish to see its nutrition and price.
        </Typography>


        {/* =================================================
            HORIZONTAL MENU
        ================================================= */}

        <Box
          className="menu-scroll"

          sx={{
            display: "flex",
            gap: "24px",

            overflowX: "auto",
            overflowY: "hidden",

            padding:
              "4px 8px 14px 8px",

            scrollSnapType:
              "x mandatory",

            "&::-webkit-scrollbar": {
              height: "8px",
            },

            "&::-webkit-scrollbar-thumb": {
              background: "#12284a",
              borderRadius: "10px",
            },

            "&::-webkit-scrollbar-track": {
              background: "#e8e1d8",
              borderRadius: "10px",
            },
          }}
        >

          {menuItems.map(
            (item, index) => (

              <motion.div

                key={item.name}

                whileHover={{
                  y: -8,
                }}

                transition={{
                  duration: 0.25,
                }}

                style={{
                  flex: "0 0 390px",
                  scrollSnapAlign:
                    "start",
                }}
              >

                <Card
                  className="salad-card salad-card-photo"

                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    position: "relative",

                    border:
                      selectedSalad.name ===
                      item.name
                        ? "2px solid #12284a"
                        : undefined,
                  }}

                  onClick={() => {
                    setSelectedSalad(item);
                  }}
                >

                  {/* BACKGROUND IMAGE */}

                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"

                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }}
                  />

                  {/* READABILITY OVERLAY */}

                  <Box

                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 0,

                      background:
                        "linear-gradient(180deg, rgba(18,40,74,0.15) 0%, rgba(18,40,74,0.45) 45%, rgba(18,40,74,0.92) 100%)",
                    }}
                  />

                  <CardContent>

                    {/* BADGE */}

                    <Chip
                      label={item.badge}
                      size="small"
                    />


                    {/* TITLE */}

                    <Typography className="salad-title">

                      {item.name}

                    </Typography>


                    {/* DESCRIPTION */}

                    <Typography className="salad-description">

                      {item.description}

                    </Typography>


                    {/* =================================================
                        NUTRITION
                    ================================================== */}

                    <Box className="nutrition-grid">

                      {/* PROTEIN */}

                      <Box className="nutrition-item protein">

                        <Typography className="nutrition-value">

                          {item.protein}

                        </Typography>

                        <Typography className="nutrition-label">

                          Protein

                        </Typography>

                      </Box>


                      {/* CARBS */}

                      <Box className="nutrition-item carbs">

                        <Typography className="nutrition-value">

                          {item.carbs}

                        </Typography>

                        <Typography className="nutrition-label">

                          Carbs

                        </Typography>

                      </Box>


                      {/* FAT */}

                      <Box className="nutrition-item fat">

                        <Typography className="nutrition-value">

                          {item.fat}

                        </Typography>

                        <Typography className="nutrition-label">

                          Fat

                        </Typography>

                      </Box>


                      {/* FIBER */}

                      <Box className="nutrition-item fiber">

                        <Typography className="nutrition-value">

                          {item.fiber}

                        </Typography>

                        <Typography className="nutrition-label">

                          Fiber

                        </Typography>

                      </Box>

                    </Box>


                    {/* DIVIDER */}

                    <Divider
                      sx={{
                        marginTop: "10px",
                        marginBottom: "8px",
                        borderColor:
                          "rgba(255,255,255,0.45)",
                      }}
                    />


                    {/* CALORIES */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        marginBottom: 0,
                      }}
                    >

                      <Whatshot
                        sx={{
                          color:
                            "#e58d9c",
                          fontSize: 16,
                          marginRight: 6,
                        }}
                      />

                      <Typography className="calories">

                        {item.calories} kcal

                      </Typography>

                    </Box>


                    {/* MICRO NUTRIENTS */}

                    <Typography className="micronutrients">

                      {item.micronutrients}

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
                          alignItems:
                            "center",
                          gap: 2,
                        }}
                      >

                        <Typography className="price">

                          ₹{item.price}

                        </Typography>


                        {item.originalPrice >
                          item.price && (

                          <Typography
                            sx={{
                              color:
                                "rgba(255,255,255,0.75)",

                              textDecoration:
                                "line-through",

                              fontSize:
                                "15px",
                            }}
                          >

                            ₹
                            {
                              item.originalPrice
                            }

                          </Typography>

                        )}

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

                          onClick={(
                            event
                          ) => {

                            event.stopPropagation();

                            setSelectedSalad(
                              item
                            );

                            handlePurchase();

                          }}

                          className="buy-button"
                        >

                          Choose this meal

                        </Button>

                      </motion.div>

                    </Box>

                  </CardContent>

                </Card>

              </motion.div>

            )
          )}

        </Box>


        {/* SCROLL HINT */}

        <Typography
          sx={{
            textAlign: "right",
            color: "#7a818b",
            fontSize: "12px",
            marginTop: "-8px",
            marginRight: "8px",
          }}
        >
          ← Scroll to explore more meals →
        </Typography>

      </motion.div>


      {/* =====================================================
          MEAL OPTIONS
      ===================================================== */}

      <Box className="meal-plans subscription-plans" id="meal-plans">
        <Box className="meal-plans-heading">
          <Typography className="section-kicker">PLANS & PRICING</Typography>
          <Typography className="meal-plans-title">Choose a plan that fits your routine</Typography>
          <Typography className="meal-plans-description">
            Pick lunch, dinner, or both. Estimates assume meals every day and use current menu prices; your total depends on the dishes you choose.
          </Typography>
        </Box>

        <Box className="meal-plans-grid">
          {subscriptionPlans.map((plan) => (
            <Card className="plan-card subscription-plan-card" key={plan.title}>
              <CardContent>
                <Typography className="plan-eyebrow">{plan.term}</Typography>
                <Typography className="plan-title">{plan.title}</Typography>
                <Typography className="plan-copy">{plan.description}</Typography>

                <Box className="subscription-price-list">
                  {[
                    { label: "Lunch", mealsPerDay: 1 },
                    { label: "Dinner", mealsPerDay: 1 },
                    { label: "Lunch + dinner", mealsPerDay: 2 },
                  ].map((option) => (
                    <Box className="subscription-price-row" key={option.label}>
                      <Typography className="subscription-meal-label">{option.label}</Typography>
                      <Typography className="subscription-meal-price">
                        {estimatePlanPrice(plan.days, option.mealsPerDay)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button className="plan-button" onClick={() => document.querySelector(".menu-scroll")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore meals
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Typography className="subscription-pricing-note">
          Estimates assume 7, 30, or 90 days of meals respectively. Delivery charges, if applicable, are not included.
        </Typography>
      </Box>


      {/* =====================================================
          DIET PLAN STARTING POINTS
      ===================================================== */}

      <Box className="diet-plans" id="diet-plans">
        <Box className="diet-plans-heading">
          <Typography className="section-kicker">PERSONALIZED NUTRITION</Typography>
          <Typography className="diet-plans-title">Start with a goal. Shape a plan around you.</Typography>
          <Typography className="diet-plans-description">
            Explore a starting point, then speak with our nutritionist about what fits your needs. These examples are not medical advice or a substitute for a personalized assessment.
          </Typography>
        </Box>

        <Box className="diet-plan-grid">
          {dietPlans.map((plan) => (
            <Card className="diet-plan-card" key={plan.title}>
              <CardContent>
                <Typography className="diet-plan-focus">{plan.focus}</Typography>
                <Typography className="diet-plan-title">{plan.title}</Typography>
                <Typography className="diet-plan-copy">{plan.description}</Typography>
                <Button
                  component="a"
                  href="https://shalinigoswami.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diet-plan-link"
                >
                  Discuss with a nutritionist
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>


      {/* =====================================================
          DIET CONSULTATION PLANS
      ===================================================== */}

      <Box className="diet-consult" id="diet-consult">

        <Box className="diet-consult-heading">
          <Typography className="section-kicker">NUTRITIONIST SUPPORT</Typography>
          <Typography className="diet-consult-title">Diet consultation plans</Typography>
          <Typography className="diet-consult-description">
            Work one-on-one with dietitian Shalini Goswami. Choose a consultation
            package, share your goals, and get guidance shaped around your routine.
          </Typography>
        </Box>

        <Box className="diet-consult-grid">

          {dietConsultPlans.map((plan) => (

            <Card className="diet-consult-card" key={plan.name}>

              <CardContent>

                <Typography className="consult-card-price">
                  {plan.price}
                </Typography>

                <Typography className="consult-card-name">
                  {plan.name}
                </Typography>

                <Typography className="consult-card-summary">
                  {plan.summary}
                </Typography>

                <Box component="ul" className="consult-features">

                  {plan.features.map((feature) => (

                    <Box component="li" key={feature} className="consult-feature">
                      {feature}
                    </Box>

                  ))}

                </Box>

                <Button
                  component="a"
                  href="https://shalinigoswami.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="consult-book-button"
                >
                  Book this plan
                </Button>

              </CardContent>

            </Card>

          ))}

        </Box>

        <Typography className="diet-consult-note">
          Consultations are scheduled directly with the nutritionist. These are
          guidance services, not medical treatment.
        </Typography>

      </Box>


      {/* =====================================================
          WHAT'S TRENDING
      ===================================================== */}

      <Typography className="section-title">
          Popular on the menu
      </Typography>

      <Box className="trending-section">

        <Box className="trending-header">

          <Box>
            <Typography className="trending-title">
              Familiar favourites, made a little more nourishing
            </Typography>

            <Typography className="trending-description">
              Explore colourful bowls and hearty meals for an easy lunch or dinner.
            </Typography>
          </Box>

          <Chip
            label="CUSTOMER FAVORITES"
            className="trending-chip"
          />

        </Box>


        <Box className="trending-grid">

          {/* Trending Item 1 */}

          <Card className="trending-card">

            <Box className="trending-image-wrapper">

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80"
                alt="Chicken salad"
                className="trending-image"
                loading="lazy"
                decoding="async"
              />

              <Chip
                label="🔥 MOST ORDERED"
                className="trending-badge"
              />

            </Box>

            <CardContent className="trending-card-content">

              <Typography className="trending-meal-title">
                Shredded Chicken with Peas
              </Typography>

              <Typography className="trending-meal-description">
                Tender shredded chicken paired with sweet peas in a savory, satisfying meal.
              </Typography>

              <Box className="trending-meal-info">

                <Typography>
                  🍗 Hearty and savory
                </Typography>

                <Typography>
                  Lunch favorite
                </Typography>

              </Box>

              <Button
                className="trending-order-button"
                onClick={() => document.querySelector(".menu-scroll")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore this meal →
              </Button>

            </CardContent>

          </Card>


          {/* Trending Item 2 */}

          <Card className="trending-card">

            <Box className="trending-image-wrapper">

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"
                alt="Fresh healthy bowl"
                className="trending-image"
                loading="lazy"
                decoding="async"
              />

              <Chip
                label="❤️ CUSTOMER LOVE"
                className="trending-badge"
              />

            </Box>

            <CardContent className="trending-card-content">

              <Typography className="trending-meal-title">
                Pumpkin Soup with Grilled Cheese Croutons
              </Typography>

              <Typography className="trending-meal-description">
                Smooth pumpkin soup finished with crisp, golden grilled-cheese croutons.
              </Typography>

              <Box className="trending-meal-info">

                <Typography>
                  🥣 Warm and comforting
                </Typography>

                <Typography>
                  Cozy meal pick
                </Typography>

              </Box>

              <Button
                className="trending-order-button"
                onClick={() => document.querySelector(".menu-scroll")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore this meal →
              </Button>

            </CardContent>

          </Card>


          {/* Trending Item 3 */}

          <Card className="trending-card">

            <Box className="trending-image-wrapper">

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
                alt="Healthy meal bowl"
                className="trending-image"
                loading="lazy"
                decoding="async"
              />

              <Chip
                label="✨ NEW FAVORITE"
                className="trending-badge"
              />

            </Box>

            <CardContent className="trending-card-content">

              <Typography className="trending-meal-title">
                Mini Avocado Lentil Rolls with Veggie Millet
              </Typography>

              <Typography className="trending-meal-description">
                Creamy avocado and lentil mini rolls served with colorful vegetable millet.
              </Typography>

              <Box className="trending-meal-info">

                <Typography>
                  🌱 Plant-forward
                </Typography>

                <Typography>
                  Fresh and filling
                </Typography>

              </Box>

              <Button
                className="trending-order-button"
                onClick={() => document.querySelector(".menu-scroll")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore this meal →
              </Button>

            </CardContent>

          </Card>

        </Box>

      </Box>


      {/* =====================================================
          PICK YOUR MOOD
      ===================================================== */}

      <Typography className="section-title">
      Find your kind of meal
      </Typography>

      <Box className="mood-section">

        <Box className="mood-header">

          <Typography className="mood-title">
            Eating well looks different for everyone
          </Typography>

          <Typography className="mood-description">
            Start with the way you live, then explore meals that fit your day.
          </Typography>

        </Box>


        <Box className="mood-grid">

          {/* Protein */}

          <Box
            className="mood-card mood-protein"
            onClick={() => {
              document
                .querySelector(".menu-scroll")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >

            <Box className="mood-icon">
              💪
            </Box>

            <Typography className="mood-card-title">
              For active days
            </Typography>

            <Typography className="mood-card-text">
              Wholesome meals with satisfying protein to complement your training routine.
            </Typography>

            <Typography className="mood-arrow">
              Explore the menu →
            </Typography>

          </Box>


          {/* Energy */}

          <Box
            className="mood-card mood-energy"
            onClick={() => {
              document
                .querySelector(".menu-scroll")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >

            <Box className="mood-icon">
              ⚡
            </Box>

            <Typography className="mood-card-title">
              For busy workdays
            </Typography>

            <Typography className="mood-card-text">
              Convenient lunch options that help make the midday break count.
            </Typography>

            <Typography className="mood-arrow">
              Explore the menu →
            </Typography>

          </Box>


          {/* Light */}

          <Box
            className="mood-card mood-light"
            onClick={() => {
              document
                .querySelector(".menu-scroll")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >

            <Box className="mood-icon">
              🥗
            </Box>

            <Typography className="mood-card-title">
              For everyday balance
            </Typography>

            <Typography className="mood-card-text">
              Bring more variety to your routine with colourful, feel-good ingredients.
            </Typography>

            <Typography className="mood-arrow">
              Explore the menu →
            </Typography>

          </Box>


          {/* Delicious */}

          <Box
            className="mood-card mood-delicious"
            onClick={() => {
              document
                .querySelector(".menu-scroll")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >

            <Box className="mood-icon">
              😋
            </Box>

            <Typography className="mood-card-title">
              For sharing at home
            </Typography>

            <Typography className="mood-card-text">
              Easy meal choices for couples, families and anyone short on prep time.
            </Typography>

            <Typography className="mood-arrow">
              Explore the menu →
            </Typography>

          </Box>

        </Box>

      </Box>


      {/* =====================================================
          LOVED BY OUR CUSTOMERS
      ===================================================== */}

      <Typography className="section-title">
        Loved By Our Customers ❤️
      </Typography>

      <Box className="reviews-section">

        <Box className="reviews-header">

          <Box>

            <Typography className="reviews-title">
              Good food should fit real life
            </Typography>

            <Typography className="reviews-description">
              Fresh, convenient meals can make a balanced routine feel more achievable.
            </Typography>

          </Box>

          <Box className="reviews-rating">

            <Typography className="reviews-rating-number">
              4.9
            </Typography>

            <Typography className="reviews-stars">
              ★★★★★
            </Typography>

            <Typography className="reviews-rating-text">
              Customer Rating
            </Typography>

          </Box>

        </Box>


        <Box className="reviews-grid">

          {/* Review 1 */}

          <Card className="review-card">

            <CardContent>

              <Typography className="review-stars">
                ★★★★★
              </Typography>

              <Typography className="review-text">
                "Fresh, filling and actually delicious.
                The chicken salad has become my
                go-to lunch."
              </Typography>

              <Box className="review-person">

                <Box className="review-avatar">
                  A
                </Box>

                <Box>

                  <Typography className="review-name">
                    Aditi
                  </Typography>

                  <Typography className="review-label">
                    Verified Customer
                  </Typography>

                </Box>

              </Box>

            </CardContent>

          </Card>


          {/* Review 2 */}

          <Card className="review-card">

            <CardContent>

              <Typography className="review-stars">
                ★★★★★
              </Typography>

              <Typography className="review-text">
                "Perfect when I want something healthy
                without compromising on taste."
              </Typography>

              <Box className="review-person">

                <Box className="review-avatar">
                  R
                </Box>

                <Box>

                  <Typography className="review-name">
                    Rahul
                  </Typography>

                  <Typography className="review-label">
                    Verified Customer
                  </Typography>

                </Box>

              </Box>

            </CardContent>

          </Card>


          {/* Review 3 */}

          <Card className="review-card">

            <CardContent>

              <Typography className="review-stars">
                ★★★★★
              </Typography>

              <Typography className="review-text">
                "The meals are fresh, tasty and
                surprisingly filling. Definitely ordering
                again!"
              </Typography>

              <Box className="review-person">

                <Box className="review-avatar">
                  S
                </Box>

                <Box>

                  <Typography className="review-name">
                    Sneha
                  </Typography>

                  <Typography className="review-label">
                    Verified Customer
                  </Typography>

                </Box>

              </Box>

            </CardContent>

          </Card>

        </Box>

      </Box>


      {/* =====================================================
          FAQ
      ===================================================== */}

      <Box className="faq-section" id="faq">

        <Box className="faq-heading">
          <Typography className="section-kicker">GOOD TO KNOW</Typography>
          <Typography className="faq-title">Frequently asked questions</Typography>
          <Typography className="faq-description">
            Quick answers about ordering, subscriptions, delivery and rewards.
          </Typography>
        </Box>

        <Box className="faq-list">

          {faqs.map((faq) => (

            <Accordion key={faq.question} className="faq-item" disableGutters>

              <AccordionSummary
                expandIcon={<ExpandMore />}
                className="faq-item-summary"
              >

                <Typography className="faq-question">
                  {faq.question}
                </Typography>

              </AccordionSummary>

              <AccordionDetails className="faq-item-details">

                <Typography className="faq-answer">
                  {faq.answer}
                </Typography>

              </AccordionDetails>

            </Accordion>

          ))}

        </Box>

      </Box>


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

        <Typography className="section-title people-section">

          People behind your plate

        </Typography>


        {/* PEOPLE GRID — DIAGONAL STAGGER: SHALINI TOP-RIGHT, WAHID BOTTOM-LEFT */}

        <Box className="people-grid">

              {profiles.map(
                (profile, index) => (

                  <motion.div
                    key={profile.name}
                    className="person-card"

                    initial={{
                      opacity: 0,
                      y: 28,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    viewport={{
                      once: true,
                    }}

                    transition={{
                      duration: 0.55,
                      delay: index * 0.15,
                    }}

                    whileHover={{
                      y: -6,

                      transition: {
                        duration: 0.25,
                      },
                    }}
                  >

                    {/* PROFILE IMAGE */}

                    <Box
                      component={
                        profile.href
                          ? "a"
                          : "div"
                      }

                      href={
                        profile.href ||
                        undefined
                      }

                      target={
                        profile.href
                          ? "_blank"
                          : undefined
                      }

                      rel={
                        profile.href
                          ? "noopener noreferrer"
                          : undefined
                      }

                      sx={{
                        display: "block",

                        textDecoration:
                          "none",
                      }}
                    >

                      <Box
                        component="img"
                        src={profile.image}
                        alt={profile.name}
                        loading="lazy"
                        decoding="async"
                        className="person-image"
                      />

                    </Box>


                    {/* PROFILE DETAILS */}

                    <Box className="person-details">

                      <Typography className="person-name">

                        {profile.name}

                      </Typography>


                      <Typography className="person-bio">

                        {profile.bio}

                      </Typography>


                      {profile.href ? (

                        <Typography
                          component="a"

                          href={profile.href}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="person-view-link"
                        >

                          View profile

                        </Typography>

                      ) : null}

                    </Box>

                  </motion.div>

                )
              )}

        </Box>

      </motion.div>


      {/* =====================================================
          FOOTER
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
          position:
            "relative",

          zIndex: 2,
        }}
      >

        <Box
          className="footer-brand"

          sx={{
            maxWidth: "1280px",

            margin:
              "70px auto 0",

            padding: "40px",

            borderTop:
              "1.5px solid #12284a",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap: 20,

            "@media (max-width: 700px)":
              {
                flexDirection:
                  "column",

                alignItems:
                  "flex-start",

                padding:
                  "30px 15px",
              },
          }}
        >

          {/* BRAND MESSAGE */}

          <Box>

            <Typography
              sx={{
                fontFamily:
                  "Manrope",

                fontSize:
                  "28px",

                fontWeight:
                  800,

                color:
                  "#12284a",
              }}
            >

              EAT WELL.

            </Typography>


            <Typography
              sx={{
                fontFamily:
                  "Manrope",

                fontSize:
                  "28px",

                fontWeight:
                  800,

                color:
                  "#e58d9c",
              }}
            >

              FEEL BETTER.

            </Typography>


            <Typography
              sx={{
                fontFamily:
                  "Manrope",

                fontSize:
                  "28px",

                fontWeight:
                  800,

                color:
                  "#12284a",
              }}
            >

              LIVE MORE.

            </Typography>

          </Box>


          {/* NUTRITIONIST LINK */}

          <Box
            sx={{
              maxWidth: 420,
              textAlign: "right",

              "@media (max-width: 700px)":
                {
                  textAlign:
                    "left",
                  maxWidth:
                    "100%",
                },
            }}
          >

            <Typography
              sx={{
                fontSize: "13px",

                lineHeight: 1.7,

                color: "#667181",

                marginBottom:
                  "12px",
              }}
            >

              Have questions about
              your nutrition,
              <br />

              diet or meal choices?

            </Typography>


            <Typography
              component="a"

              href="https://shalinigoswami.netlify.app/"

              target="_blank"

              rel="noopener noreferrer"

              sx={{
                display:
                  "inline-block",

                color:
                  "#12284a",

                fontFamily:
                  "Manrope",

                fontSize:
                  "16px",

                fontWeight:
                  800,

                textDecoration:
                  "none",

                borderBottom:
                  "2px solid #e58d9c",

                paddingBottom:
                  "3px",

                transition:
                  "all 0.25s ease",

                "&:hover": {
                  color:
                    "#e58d9c",

                  borderBottomColor:
                    "#12284a",
                },
              }}
            >

              Consult with our nutritionist →

            </Typography>

          </Box>

        </Box>

      </motion.div>


      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      <PaymentModal

        open={
          paymentModalOpen
        }

        onClose={() =>
          setPaymentModalOpen(false)
        }

        amount={
          selectedSalad.price
        }

        userName={
          userName
        }

        onPaymentSuccess={
          handlePaymentSuccess
        }

      />

    </Box>
  );
};


export default Dashboard;