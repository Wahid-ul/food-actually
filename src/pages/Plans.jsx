import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  LinearProgress,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  PersonOutlined,
  PhoneOutlined,
  EmailOutlined,
  LocationOnOutlined,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  CalendarMonth,
  Restaurant,
  FitnessCenter,
  Spa,
} from "@mui/icons-material";
import Navbar from "./Navbar";
import { getCurrentUser } from "../utils/auth";

// ─── plan data ───────────────────────────────────────────────────────────────

const MEAL_PRICE_MIN = 219;
const MEAL_PRICE_MAX = 299;

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const estimateRange = (days, mealsPerDay) =>
  `${formatPrice(MEAL_PRICE_MIN * days * mealsPerDay)} – ${formatPrice(MEAL_PRICE_MAX * days * mealsPerDay)}`;

const SUBSCRIPTION_PLANS = [
  {
    id: "weekly",
    title: "Weekly Plan",
    term: "7 DAYS",
    days: 7,
    icon: "📅",
    color: "#e8f4fd",
    accent: "#4a9fd4",
    description:
      "Try a week of ready-to-enjoy meals and build an easier routine. A perfect way to see if meal delivery fits your lifestyle.",
    highlights: ["Fresh daily delivery", "Flexible meal slots", "No long-term commitment"],
    options: [
      { label: "Lunch only", mealsPerDay: 1 },
      { label: "Dinner only", mealsPerDay: 1 },
      { label: "Lunch + Dinner", mealsPerDay: 2 },
    ],
  },
  {
    id: "monthly",
    title: "One Month Plan",
    term: "30 DAYS",
    days: 30,
    icon: "🗓️",
    color: "#fef3f5",
    accent: "#e58d9c",
    popular: true,
    description:
      "Keep lunch, dinner, or both covered throughout the month. Build a consistent routine that actually sticks.",
    highlights: ["Consistent daily meals", "Nutritionist check-in", "Priority delivery slots"],
    options: [
      { label: "Lunch only", mealsPerDay: 1 },
      { label: "Dinner only", mealsPerDay: 1 },
      { label: "Lunch + Dinner", mealsPerDay: 2 },
    ],
  },
  {
    id: "quarterly",
    title: "Three Month Plan",
    term: "90 DAYS",
    days: 90,
    icon: "🎯",
    color: "#f0faf4",
    accent: "#4caf7a",
    description:
      "Plan further ahead for noticeable, lasting change. Ideal for fitness goals, weight management, or building a long-term healthy habit.",
    highlights: ["Full nutritionist support", "Plan evolution as you progress", "Best value per meal"],
    options: [
      { label: "Lunch only", mealsPerDay: 1 },
      { label: "Dinner only", mealsPerDay: 1 },
      { label: "Lunch + Dinner", mealsPerDay: 2 },
    ],
  },
];

const DIET_PLANS = [
  {
    id: "gym",
    title: "Gym Training",
    focus: "HIGH PROTEIN + HIGH FIBER",
    emoji: "💪",
    color: "#fff8f0",
    accent: "#f4813a",
    description:
      "Fuel your workouts with protein-rich meals designed around training schedules. High-fiber ingredients to aid recovery and keep energy levels steady.",
    bestFor: ["Active gym-goers", "Athletes", "Strength training"],
    meals: ["Grilled Chicken Salad", "Egg Protein Bowl", "Millet Protein Bowl"],
  },
  {
    id: "keto",
    title: "Keto-style",
    focus: "LOWER-CARB PREFERENCES",
    emoji: "🥑",
    color: "#f5f0fb",
    accent: "#9c6fe4",
    description:
      "A reduced-carb approach focused on healthy fats and clean protein. Best discussed with our nutritionist before making significant dietary changes.",
    bestFor: ["Weight management", "Blood sugar control", "Low-carb preference"],
    meals: ["Grilled Chicken Salad", "Egg Protein Bowl", "Paneer Salad"],
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    focus: "BALANCED EVERYDAY HABITS",
    emoji: "⚖️",
    color: "#fef3f5",
    accent: "#e58d9c",
    description:
      "A consistent, balanced meal pattern built around real food and sustainable habits — not crash diets or extreme restrictions.",
    bestFor: ["Sustainable fat loss", "Portion control", "Long-term habits"],
    meals: ["Chickpea Power Bowl", "Millet Protein Bowl", "Paneer Salad"],
  },
  {
    id: "muscle",
    title: "Muscle Gain",
    focus: "TRAINING + NUTRITION",
    emoji: "🏋️",
    color: "#f0faf4",
    accent: "#4caf7a",
    description:
      "Designed for those looking to build lean muscle mass. Calorie-dense, protein-forward meals that support progressive training.",
    bestFor: ["Muscle building", "Bulking phase", "Performance athletes"],
    meals: ["Grilled Chicken Salad", "Egg Protein Bowl", "Chickpea Power Bowl"],
  },
];

const CONSULT_PLANS = [
  {
    id: "starter",
    title: "Starter Consult",
    price: "₹499",
    duration: "1 session",
    emoji: "🌱",
    color: "#f0faf4",
    accent: "#4caf7a",
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
    id: "monthly-consult",
    title: "Monthly Guidance",
    price: "₹1,499",
    duration: "1 month",
    emoji: "📋",
    color: "#fef3f5",
    accent: "#e58d9c",
    popular: true,
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
    id: "quarterly-consult",
    title: "Quarterly Program",
    price: "₹3,999",
    duration: "3 months",
    emoji: "🏆",
    color: "#fff8f0",
    accent: "#f4813a",
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

// ─── questionnaire helpers ────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── main component ───────────────────────────────────────────────────────────

export default function Plans() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);
  const userName =
    currentUser?.name || localStorage.getItem("userName") || "Guest";

  // which section tab is active
  const [activeTab, setActiveTab] = useState("meal-plans");

  // selected plan to enroll in
  const [selectedPlan, setSelectedPlan] = useState(null);

  // questionnaire phase: null | "form" | "submitted"
  const [phase, setPhase] = useState(null);

  // ── questionnaire state ────────────────────────────────────────────────

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [personal, setPersonal] = useState({ fullName: "", email: "", phone: "", pincode: "" });
  const [personalErrors, setPersonalErrors] = useState({});

  const [lifestyle, setLifestyle] = useState({
    activityLevel: "",
    mealsPerDay: "",
    dietaryPreference: "",
    healthConditions: [],
  });
  const [lifestyleErrors, setLifestyleErrors] = useState({});

  const [goal, setGoal] = useState("");
  const [goalError, setGoalError] = useState("");

  // ── validation ─────────────────────────────────────────────────────────

  const validatePersonal = () => {
    const errors = {};
    if (!personal.fullName.trim()) errors.fullName = "Full name is required.";
    if (!personal.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!personal.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(personal.phone.replace(/\s/g, ""))) {
      errors.phone = "Enter a 10-digit phone number.";
    }
    if (!personal.pincode.trim()) {
      errors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(personal.pincode)) {
      errors.pincode = "Enter a valid 6-digit pincode.";
    }
    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLifestyle = () => {
    const errors = {};
    if (!lifestyle.activityLevel) errors.activityLevel = "Please select your activity level.";
    if (!lifestyle.mealsPerDay) errors.mealsPerDay = "Please select how many meals you have per day.";
    if (!lifestyle.dietaryPreference) errors.dietaryPreference = "Please select a dietary preference.";
    setLifestyleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateGoal = () => {
    if (!goal) { setGoalError("Please choose a goal."); return false; }
    setGoalError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validatePersonal()) return;
    if (step === 2 && !validateLifestyle()) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!validateGoal()) return;
    setPhase("submitted");
  };

  const toggleCondition = (condition) => {
    setLifestyle((prev) => {
      const exists = prev.healthConditions.includes(condition);
      return {
        ...prev,
        healthConditions: exists
          ? prev.healthConditions.filter((c) => c !== condition)
          : [...prev.healthConditions, condition],
      };
    });
  };

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setStep(1);
    setDirection(1);
    setPersonal({ fullName: "", email: "", phone: "", pincode: "" });
    setPersonalErrors({});
    setLifestyle({ activityLevel: "", mealsPerDay: "", dietaryPreference: "", healthConditions: [] });
    setLifestyleErrors({});
    setGoal("");
    setGoalError("");
    setPhase("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── SUBMITTED screen ───────────────────────────────────────────────────

  if (phase === "submitted") {
    return (
      <Box className="questionnaire-page">
        <div className="dashboard-header-shell">
          <Navbar isLoggedIn={isLoggedIn} userName={userName} />
        </div>
        <motion.div
          className="questionnaire-success"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <CheckCircle className="success-icon" />
          <Typography className="success-title">We'll connect with you soon!</Typography>
          <Box className="success-plan-badge">
            <Typography className="success-plan-label">Selected plan</Typography>
            <Typography className="success-plan-name">
              {selectedPlan?.title || selectedPlan?.name}
            </Typography>
          </Box>
          <Typography className="success-body">
            Thanks, <strong>{personal.fullName || userName}</strong>! We've received your details for the{" "}
            <strong>{selectedPlan?.title || selectedPlan?.name}</strong>. Our nutritionist will review your profile and get back to you within 24–48 hours to kick things off.
          </Typography>
          <Button className="success-cta" onClick={() => navigate("/")}>
            Back to home
          </Button>
          <Button
            className="q-btn-back"
            onClick={() => { setPhase(null); setSelectedPlan(null); }}
            style={{ marginTop: 4 }}
          >
            View other plans
          </Button>
        </motion.div>
      </Box>
    );
  }

  // ── QUESTIONNAIRE screen ───────────────────────────────────────────────

  if (phase === "form") {
    return (
      <Box className="questionnaire-page">
        <div className="dashboard-header-shell">
          <Navbar isLoggedIn={isLoggedIn} userName={userName} />
        </div>
        <Box className="questionnaire-container">

          {/* selected plan pill */}
          <Box className="plans-q-selected-pill">
            <Typography className="plans-q-selected-label">You chose:</Typography>
            <Typography className="plans-q-selected-name">
              {selectedPlan?.title || selectedPlan?.name}
            </Typography>
          </Box>

          {/* header */}
          <Box className="questionnaire-header">
            <Typography className="questionnaire-kicker">ALMOST THERE</Typography>
            <Typography className="questionnaire-title">Tell us about yourself</Typography>
            <Typography className="questionnaire-subtitle">
              Three quick steps and we'll have everything we need to personalise your{" "}
              <strong>{selectedPlan?.title || selectedPlan?.name}</strong>.
            </Typography>
          </Box>

          {/* progress */}
          <Box className="questionnaire-progress-wrap">
            <Box className="questionnaire-step-labels">
              {["Personal info", "Lifestyle", "Your goal"].map((label, i) => (
                <Box
                  key={label}
                  className={`questionnaire-step-label ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                >
                  <Box className="step-dot">{step > i + 1 ? "✓" : i + 1}</Box>
                  <Typography className="step-label-text">{label}</Typography>
                </Box>
              ))}
            </Box>
            <LinearProgress
              variant="determinate"
              value={((step - 1) / TOTAL_STEPS) * 100 + 100 / TOTAL_STEPS / 2}
              className="questionnaire-progress-bar"
            />
          </Box>

          {/* step card */}
          <Box className="questionnaire-card-wrap">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="questionnaire-card"
              >

                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <Box className="q-step-content">
                    <Typography className="q-step-heading">Personal information</Typography>
                    <Typography className="q-step-desc">
                      We use this to get in touch and deliver your plan to the right place.
                    </Typography>
                    <Box className="q-fields-grid">
                      <TextField
                        label="Full name"
                        value={personal.fullName}
                        onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                        error={Boolean(personalErrors.fullName)}
                        helperText={personalErrors.fullName}
                        fullWidth
                        className="q-field"
                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlined className="q-field-icon" /></InputAdornment> }}
                      />
                      <TextField
                        label="Email address"
                        type="email"
                        value={personal.email}
                        onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                        error={Boolean(personalErrors.email)}
                        helperText={personalErrors.email}
                        fullWidth
                        className="q-field"
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined className="q-field-icon" /></InputAdornment> }}
                      />
                      <TextField
                        label="Phone number"
                        type="tel"
                        value={personal.phone}
                        onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                        error={Boolean(personalErrors.phone)}
                        helperText={personalErrors.phone}
                        fullWidth
                        className="q-field"
                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlined className="q-field-icon" /></InputAdornment> }}
                      />
                      <TextField
                        label="Pincode"
                        value={personal.pincode}
                        onChange={(e) => setPersonal({ ...personal, pincode: e.target.value })}
                        error={Boolean(personalErrors.pincode)}
                        helperText={personalErrors.pincode}
                        fullWidth
                        className="q-field"
                        InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlined className="q-field-icon" /></InputAdornment> }}
                      />
                    </Box>
                  </Box>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <Box className="q-step-content">
                    <Typography className="q-step-heading">Your current lifestyle</Typography>
                    <Typography className="q-step-desc">
                      This helps us understand what a realistic plan looks like for your day-to-day life.
                    </Typography>

                    <Box className="q-section">
                      <Typography className="q-section-label">How active are you on most days?</Typography>
                      <RadioGroup
                        value={lifestyle.activityLevel}
                        onChange={(e) => setLifestyle({ ...lifestyle, activityLevel: e.target.value })}
                        className="q-radio-group"
                      >
                        {[
                          { value: "sedentary", label: "Mostly sedentary — desk job or limited movement" },
                          { value: "light", label: "Light activity — short walks, light household work" },
                          { value: "moderate", label: "Moderately active — regular walks or light workouts" },
                          { value: "active", label: "Very active — daily workouts or physically demanding job" },
                        ].map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio className="q-radio" />}
                            label={opt.label}
                            className={`q-radio-option ${lifestyle.activityLevel === opt.value ? "selected" : ""}`}
                          />
                        ))}
                      </RadioGroup>
                      {lifestyleErrors.activityLevel && <Typography className="q-error">{lifestyleErrors.activityLevel}</Typography>}
                    </Box>

                    <Box className="q-section">
                      <Typography className="q-section-label">How many main meals do you typically have per day?</Typography>
                      <RadioGroup
                        value={lifestyle.mealsPerDay}
                        onChange={(e) => setLifestyle({ ...lifestyle, mealsPerDay: e.target.value })}
                        className="q-radio-group q-radio-group-row"
                      >
                        {["1", "2", "3", "4+"].map((opt) => (
                          <FormControlLabel
                            key={opt}
                            value={opt}
                            control={<Radio className="q-radio" />}
                            label={opt}
                            className={`q-radio-option q-radio-option-sm ${lifestyle.mealsPerDay === opt ? "selected" : ""}`}
                          />
                        ))}
                      </RadioGroup>
                      {lifestyleErrors.mealsPerDay && <Typography className="q-error">{lifestyleErrors.mealsPerDay}</Typography>}
                    </Box>

                    <Box className="q-section">
                      <Typography className="q-section-label">Dietary preference</Typography>
                      <RadioGroup
                        value={lifestyle.dietaryPreference}
                        onChange={(e) => setLifestyle({ ...lifestyle, dietaryPreference: e.target.value })}
                        className="q-radio-group q-radio-group-row"
                      >
                        {[
                          { value: "vegetarian", label: "Vegetarian" },
                          { value: "non-vegetarian", label: "Non-veg" },
                          { value: "vegan", label: "Vegan" },
                          { value: "no-preference", label: "No preference" },
                        ].map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio className="q-radio" />}
                            label={opt.label}
                            className={`q-radio-option q-radio-option-sm ${lifestyle.dietaryPreference === opt.value ? "selected" : ""}`}
                          />
                        ))}
                      </RadioGroup>
                      {lifestyleErrors.dietaryPreference && <Typography className="q-error">{lifestyleErrors.dietaryPreference}</Typography>}
                    </Box>

                    <Box className="q-section">
                      <Typography className="q-section-label">
                        Any health conditions? <span className="q-optional">(optional)</span>
                      </Typography>
                      <FormGroup className="q-checkbox-group">
                        {["Diabetes", "Hypertension", "PCOS / PCOD", "Thyroid disorder", "Digestive issues", "None of the above"].map((condition) => (
                          <FormControlLabel
                            key={condition}
                            control={
                              <Checkbox
                                checked={lifestyle.healthConditions.includes(condition)}
                                onChange={() => toggleCondition(condition)}
                                className="q-checkbox"
                              />
                            }
                            label={condition}
                            className={`q-checkbox-option ${lifestyle.healthConditions.includes(condition) ? "selected" : ""}`}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </Box>
                )}

                {/* ── STEP 3 ── */}
                {step === 3 && (
                  <Box className="q-step-content">
                    <Typography className="q-step-heading">Choose your goal</Typography>
                    <Typography className="q-step-desc">
                      Pick the goal that matters most to you right now. Our nutritionist will tailor the approach around it.
                    </Typography>
                    <Box className="q-goal-grid">
                      {[
                        { value: "weight-loss", emoji: "⚖️", title: "Weight loss", desc: "Build a balanced, sustainable routine to reach a healthier weight." },
                        { value: "muscle-gain", emoji: "💪", title: "Muscle gain", desc: "Fuel your training with the protein and energy your body needs." },
                        { value: "energy-stamina", emoji: "⚡", title: "Energy & stamina", desc: "Reduce fatigue and feel more consistent through the day." },
                        { value: "gut-health", emoji: "🌿", title: "Gut & digestive health", desc: "Improve digestion and build a more comfortable everyday routine." },
                        { value: "general-wellness", emoji: "🥗", title: "General wellness", desc: "Eat a little better, feel a little lighter — no specific target." },
                        { value: "medical-condition", emoji: "🩺", title: "Managing a health condition", desc: "Get nutritional support aligned with your existing health condition." },
                      ].map((opt) => (
                        <Box
                          key={opt.value}
                          className={`q-goal-card ${goal === opt.value ? "selected" : ""}`}
                          onClick={() => { setGoal(opt.value); setGoalError(""); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setGoal(opt.value); setGoalError(""); } }}
                          aria-pressed={goal === opt.value}
                        >
                          <Typography className="q-goal-emoji">{opt.emoji}</Typography>
                          <Typography className="q-goal-title">{opt.title}</Typography>
                          <Typography className="q-goal-desc">{opt.desc}</Typography>
                          {goal === opt.value && <Box className="q-goal-check">✓</Box>}
                        </Box>
                      ))}
                    </Box>
                    {goalError && <Typography className="q-error q-error-center">{goalError}</Typography>}
                  </Box>
                )}

              </motion.div>
            </AnimatePresence>
          </Box>

          {/* nav buttons */}
          <Box className="questionnaire-nav">
            {step > 1 ? (
              <Button className="q-btn-back" startIcon={<ArrowBack />} onClick={handleBack}>Back</Button>
            ) : (
              <Button className="q-btn-back" startIcon={<ArrowBack />} onClick={() => setPhase(null)}>Back to plans</Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button className="q-btn-next" endIcon={<ArrowForward />} onClick={handleNext}>Continue</Button>
            ) : (
              <Button className="q-btn-submit" endIcon={<CheckCircle />} onClick={handleSubmit}>Submit</Button>
            )}
          </Box>

        </Box>
      </Box>
    );
  }

  // ── PLANS listing screen ───────────────────────────────────────────────

  return (
    <Box className="questionnaire-page plans-page">
      <div className="dashboard-header-shell">
        <Navbar isLoggedIn={isLoggedIn} userName={userName} />
      </div>

      <Box className="plans-container">

        {/* ── hero ──────────────────────────────────────────────────────── */}
        <motion.div
          className="plans-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typography className="plans-hero-kicker">ALL PLANS</Typography>
          <Typography className="plans-hero-title">Find the plan that fits your life</Typography>
          <Typography className="plans-hero-subtitle">
            Whether you want convenient meal delivery, a structured diet approach, or one-on-one
            nutritionist support — choose a plan and we'll personalise the rest.
          </Typography>
        </motion.div>

        {/* ── tabs ──────────────────────────────────────────────────────── */}
        <Box className="plans-tabs">
          {[
            { id: "meal-plans", label: "Meal Subscriptions", icon: <Restaurant fontSize="small" /> },
            { id: "diet-plans", label: "Diet Plans", icon: <FitnessCenter fontSize="small" /> },
            { id: "consult-plans", label: "Nutrition Consults", icon: <Spa fontSize="small" /> },
          ].map((tab) => (
            <Button
              key={tab.id}
              className={`plans-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              startIcon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* ── MEAL SUBSCRIPTION PLANS ───────────────────────────────────── */}
        {activeTab === "meal-plans" && (
          <motion.div
            key="meal-plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Box className="plans-section-intro">
              <Typography className="plans-section-title">Meal Subscription Plans</Typography>
              <Typography className="plans-section-desc">
                Fresh meals delivered daily. Pick a duration, choose lunch or dinner (or both), and we'll handle the rest. Prices are estimates based on current menu options.
              </Typography>
            </Box>

            <Box className="plans-grid">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="plans-card-wrap"
                >
                  <Card className="plans-card" style={{ background: plan.color, borderColor: plan.popular ? plan.accent : undefined }}>
                    {plan.popular && <Chip label="MOST POPULAR" className="plans-popular-chip" style={{ background: plan.accent }} />}
                    <CardContent className="plans-card-content">
                      <Box className="plans-card-top">
                        <Typography className="plans-card-emoji">{plan.icon}</Typography>
                        <Box>
                          <Typography className="plans-card-term">{plan.term}</Typography>
                          <Typography className="plans-card-title">{plan.title}</Typography>
                        </Box>
                      </Box>

                      <Typography className="plans-card-desc">{plan.description}</Typography>

                      <Box className="plans-highlights">
                        {plan.highlights.map((h) => (
                          <Box key={h} className="plans-highlight-item">
                            <span className="plans-highlight-dot" style={{ background: plan.accent }} />
                            <Typography className="plans-highlight-text">{h}</Typography>
                          </Box>
                        ))}
                      </Box>

                      <Divider className="plans-divider" />

                      <Typography className="plans-price-label">Estimated pricing</Typography>
                      <Box className="plans-price-list">
                        {plan.options.map((opt) => (
                          <Box key={opt.label} className="plans-price-row">
                            <Typography className="plans-price-option">{opt.label}</Typography>
                            <Typography className="plans-price-value" style={{ color: plan.accent }}>
                              {estimateRange(plan.days, opt.mealsPerDay)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Button
                        className="plans-choose-btn"
                        style={{ background: plan.accent }}
                        onClick={() => handleChoosePlan(plan)}
                        endIcon={<ArrowForward />}
                      >
                        Choose this plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
            <Typography className="plans-pricing-note">
              Estimates assume meals every day and use current menu prices. Delivery charges, if applicable, are not included.
            </Typography>
          </motion.div>
        )}

        {/* ── DIET PLANS ────────────────────────────────────────────────── */}
        {activeTab === "diet-plans" && (
          <motion.div
            key="diet-plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Box className="plans-section-intro">
              <Typography className="plans-section-title">Diet Plans</Typography>
              <Typography className="plans-section-desc">
                Starting points tailored to your goal. Pick the one that resonates, and our nutritionist will refine the details around your lifestyle. These are guides, not medical prescriptions.
              </Typography>
            </Box>

            <Box className="plans-grid plans-grid-2">
              {DIET_PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="plans-card-wrap"
                >
                  <Card className="plans-card" style={{ background: plan.color, borderColor: "transparent" }}>
                    <CardContent className="plans-card-content">
                      <Box className="plans-card-top">
                        <Typography className="plans-card-emoji">{plan.emoji}</Typography>
                        <Box>
                          <Typography className="plans-card-term" style={{ color: plan.accent }}>{plan.focus}</Typography>
                          <Typography className="plans-card-title">{plan.title}</Typography>
                        </Box>
                      </Box>

                      <Typography className="plans-card-desc">{plan.description}</Typography>

                      <Box className="plans-highlights">
                        <Typography className="plans-sub-label">Best for</Typography>
                        {plan.bestFor.map((b) => (
                          <Box key={b} className="plans-highlight-item">
                            <span className="plans-highlight-dot" style={{ background: plan.accent }} />
                            <Typography className="plans-highlight-text">{b}</Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box className="plans-meal-tags">
                        <Typography className="plans-sub-label">Suggested meals</Typography>
                        <Box className="plans-meal-tag-list">
                          {plan.meals.map((m) => (
                            <Chip key={m} label={m} size="small" className="plans-meal-tag" style={{ borderColor: plan.accent, color: plan.accent }} />
                          ))}
                        </Box>
                      </Box>

                      <Button
                        className="plans-choose-btn"
                        style={{ background: plan.accent }}
                        onClick={() => handleChoosePlan(plan)}
                        endIcon={<ArrowForward />}
                      >
                        Start this plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}

        {/* ── CONSULT PLANS ─────────────────────────────────────────────── */}
        {activeTab === "consult-plans" && (
          <motion.div
            key="consult-plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Box className="plans-section-intro">
              <Typography className="plans-section-title">Nutrition Consultation Plans</Typography>
              <Typography className="plans-section-desc">
                Work one-on-one with dietitian Shalini Goswami. Choose a package that matches how much support you need, and we'll set everything up after you fill in your details.
              </Typography>
            </Box>

            <Box className="plans-grid">
              {CONSULT_PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="plans-card-wrap"
                >
                  <Card className="plans-card" style={{ background: plan.color, borderColor: plan.popular ? plan.accent : undefined }}>
                    {plan.popular && <Chip label="MOST POPULAR" className="plans-popular-chip" style={{ background: plan.accent }} />}
                    <CardContent className="plans-card-content">
                      <Box className="plans-card-top">
                        <Typography className="plans-card-emoji">{plan.emoji}</Typography>
                        <Box>
                          <Typography className="plans-card-term">{plan.duration}</Typography>
                          <Typography className="plans-card-title">{plan.title}</Typography>
                        </Box>
                      </Box>

                      <Typography className="plans-consult-price" style={{ color: plan.accent }}>
                        {plan.price}
                      </Typography>

                      <Typography className="plans-card-desc">{plan.summary}</Typography>

                      <Box component="ul" className="plans-feature-list">
                        {plan.features.map((f) => (
                          <Box component="li" key={f} className="plans-feature-item">
                            <span className="plans-highlight-dot" style={{ background: plan.accent }} />
                            {f}
                          </Box>
                        ))}
                      </Box>

                      <Button
                        className="plans-choose-btn"
                        style={{ background: plan.accent }}
                        onClick={() => handleChoosePlan(plan)}
                        endIcon={<ArrowForward />}
                      >
                        Book this plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
            <Typography className="plans-pricing-note">
              Consultations are scheduled directly with the nutritionist. These are guidance services, not medical treatment.
            </Typography>
          </motion.div>
        )}

      </Box>
    </Box>
  );
}
