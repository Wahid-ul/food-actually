import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  LinearProgress,
  InputAdornment,
} from "@mui/material";
import {
  PersonOutlined,
  PhoneOutlined,
  EmailOutlined,
  LocationOnOutlined,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import Navbar from "./Navbar";
import { getCurrentUser } from "../utils/auth";

// ─── helpers ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
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

// ─── component ──────────────────────────────────────────────────────────────

export default function Questionnaire() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);
  const userName =
    currentUser?.name || localStorage.getItem("userName") || "Guest";

  // ── form state ──────────────────────────────────────────────────────────

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — personal info
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    pincode: "",
  });
  const [personalErrors, setPersonalErrors] = useState({});

  // Step 2 — lifestyle
  const [lifestyle, setLifestyle] = useState({
    activityLevel: "",
    mealsPerDay: "",
    dietaryPreference: "",
    healthConditions: [],
  });
  const [lifestyleErrors, setLifestyleErrors] = useState({});

  // Step 3 — goal
  const [goal, setGoal] = useState("");
  const [goalError, setGoalError] = useState("");

  // ── validation ──────────────────────────────────────────────────────────

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
    if (!goal) {
      setGoalError("Please choose a goal.");
      return false;
    }
    setGoalError("");
    return true;
  };

  // ── navigation ──────────────────────────────────────────────────────────

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
    setSubmitted(true);
  };

  // ── health condition toggles ────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────

  if (submitted) {
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
          <Typography className="success-body">
            Thanks for filling out your questionnaire, <strong>{personal.fullName || userName}</strong>. Our nutritionist will review your profile and get in touch with you within 24–48 hours to set up your personalised plan.
          </Typography>
          <Button
            className="success-cta"
            onClick={() => navigate("/")}
          >
            Back to home
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box className="questionnaire-page">
      <div className="dashboard-header-shell">
        <Navbar isLoggedIn={isLoggedIn} userName={userName} />
      </div>

      <Box className="questionnaire-container">

        {/* ── header ──────────────────────────────────────────────────────── */}

        <Box className="questionnaire-header">
          <Typography className="questionnaire-kicker">PERSONALISE YOUR PLAN</Typography>
          <Typography className="questionnaire-title">Tell us about yourself</Typography>
          <Typography className="questionnaire-subtitle">
            Three quick steps and we'll have everything we need to shape a plan around you.
          </Typography>
        </Box>

        {/* ── progress bar ────────────────────────────────────────────────── */}

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

        {/* ── step card ───────────────────────────────────────────────────── */}

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

              {/* ══════════════════════════════════════════════════════════
                  STEP 1 — PERSONAL INFORMATION
              ══════════════════════════════════════════════════════════ */}

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
                      onChange={(e) =>
                        setPersonal({ ...personal, fullName: e.target.value })
                      }
                      error={Boolean(personalErrors.fullName)}
                      helperText={personalErrors.fullName}
                      fullWidth
                      className="q-field"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlined className="q-field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Email address"
                      type="email"
                      value={personal.email}
                      onChange={(e) =>
                        setPersonal({ ...personal, email: e.target.value })
                      }
                      error={Boolean(personalErrors.email)}
                      helperText={personalErrors.email}
                      fullWidth
                      className="q-field"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined className="q-field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Phone number"
                      type="tel"
                      value={personal.phone}
                      onChange={(e) =>
                        setPersonal({ ...personal, phone: e.target.value })
                      }
                      error={Boolean(personalErrors.phone)}
                      helperText={personalErrors.phone}
                      fullWidth
                      className="q-field"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlined className="q-field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Pincode"
                      value={personal.pincode}
                      onChange={(e) =>
                        setPersonal({ ...personal, pincode: e.target.value })
                      }
                      error={Boolean(personalErrors.pincode)}
                      helperText={personalErrors.pincode}
                      fullWidth
                      className="q-field"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnOutlined className="q-field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STEP 2 — LIFESTYLE
              ══════════════════════════════════════════════════════════ */}

              {step === 2 && (
                <Box className="q-step-content">
                  <Typography className="q-step-heading">Your current lifestyle</Typography>
                  <Typography className="q-step-desc">
                    This helps us understand what a realistic plan looks like for your day-to-day life.
                  </Typography>

                  {/* Activity level */}
                  <Box className="q-section">
                    <Typography className="q-section-label">
                      How active are you on most days?
                    </Typography>
                    <RadioGroup
                      value={lifestyle.activityLevel}
                      onChange={(e) =>
                        setLifestyle({ ...lifestyle, activityLevel: e.target.value })
                      }
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
                    {lifestyleErrors.activityLevel && (
                      <Typography className="q-error">{lifestyleErrors.activityLevel}</Typography>
                    )}
                  </Box>

                  {/* Meals per day */}
                  <Box className="q-section">
                    <Typography className="q-section-label">
                      How many main meals do you typically have per day?
                    </Typography>
                    <RadioGroup
                      value={lifestyle.mealsPerDay}
                      onChange={(e) =>
                        setLifestyle({ ...lifestyle, mealsPerDay: e.target.value })
                      }
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
                    {lifestyleErrors.mealsPerDay && (
                      <Typography className="q-error">{lifestyleErrors.mealsPerDay}</Typography>
                    )}
                  </Box>

                  {/* Dietary preference */}
                  <Box className="q-section">
                    <Typography className="q-section-label">
                      Dietary preference
                    </Typography>
                    <RadioGroup
                      value={lifestyle.dietaryPreference}
                      onChange={(e) =>
                        setLifestyle({ ...lifestyle, dietaryPreference: e.target.value })
                      }
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
                    {lifestyleErrors.dietaryPreference && (
                      <Typography className="q-error">{lifestyleErrors.dietaryPreference}</Typography>
                    )}
                  </Box>

                  {/* Health conditions (optional) */}
                  <Box className="q-section">
                    <Typography className="q-section-label">
                      Any health conditions? <span className="q-optional">(optional)</span>
                    </Typography>
                    <FormGroup className="q-checkbox-group">
                      {[
                        "Diabetes",
                        "Hypertension",
                        "PCOS / PCOD",
                        "Thyroid disorder",
                        "Digestive issues",
                        "None of the above",
                      ].map((condition) => (
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

              {/* ══════════════════════════════════════════════════════════
                  STEP 3 — GOAL
              ══════════════════════════════════════════════════════════ */}

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
                        onClick={() => {
                          setGoal(opt.value);
                          setGoalError("");
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setGoal(opt.value);
                            setGoalError("");
                          }
                        }}
                        aria-pressed={goal === opt.value}
                      >
                        <Typography className="q-goal-emoji">{opt.emoji}</Typography>
                        <Typography className="q-goal-title">{opt.title}</Typography>
                        <Typography className="q-goal-desc">{opt.desc}</Typography>
                        {goal === opt.value && (
                          <Box className="q-goal-check">✓</Box>
                        )}
                      </Box>
                    ))}
                  </Box>

                  {goalError && (
                    <Typography className="q-error q-error-center">{goalError}</Typography>
                  )}
                </Box>
              )}

            </motion.div>
          </AnimatePresence>
        </Box>

        {/* ── navigation buttons ──────────────────────────────────────────── */}

        <Box className="questionnaire-nav">
          {step > 1 ? (
            <Button
              className="q-btn-back"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <Button
              className="q-btn-back"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
            >
              Back to home
            </Button>
          )}

          {step < TOTAL_STEPS ? (
            <Button
              className="q-btn-next"
              endIcon={<ArrowForward />}
              onClick={handleNext}
            >
              Continue
            </Button>
          ) : (
            <Button
              className="q-btn-submit"
              endIcon={<CheckCircle />}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </Box>

      </Box>
    </Box>
  );
}
