import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import {
  Close,
  CheckCircle,
  StarRounded,
  StarOutlineRounded,
  PersonOutlined,
  Restaurant,
  EmojiEventsOutlined,
} from "@mui/icons-material";

const RATINGS = [1, 2, 3, 4, 5];

export default function FeedbackModal({
  open,
  onClose,
  userName = "Guest",
  saladsPurchased = 0,
  points = 0,
  lastMeal = "—",
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!rating) e.rating = "Please select a rating.";
    if (!category) e.category = "Please pick a category.";
    if (!message.trim()) e.message = "Please write a short message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setTimeout(() => {
      setRating(0);
      setHovered(0);
      setCategory("");
      setMessage("");
      setSubmitted(false);
      setErrors({});
    }, 300);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="feedback-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
          />

          {/* modal shell — fixed position, vertically scrollable */}
          <motion.div
            className="feedback-modal"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* close button */}
            <IconButton
              className="feedback-close"
              onClick={handleClose}
              aria-label="Close feedback"
            >
              <Close fontSize="small" />
            </IconButton>

            {submitted ? (
              /* ── success ── */
              <Box className="feedback-success">
                <CheckCircle className="feedback-success-icon" />
                <Typography className="feedback-success-title">
                  Thank you, {userName}!
                </Typography>
                <Typography className="feedback-success-body">
                  Your feedback has been received. We'll use it to keep improving your experience.
                </Typography>
                <Button className="feedback-submit-btn" onClick={handleClose}>
                  Close
                </Button>
              </Box>
            ) : (
              <Box className="feedback-form">

                {/* ── user info card ── */}
                <Box className="feedback-user-card">
                  <Box className="feedback-user-avatar">
                    {userName.charAt(0).toUpperCase()}
                  </Box>
                  <Box className="feedback-user-info">
                    <Typography className="feedback-user-name">{userName}</Typography>
                    <Typography className="feedback-user-sub">Sharing feedback</Typography>
                  </Box>
                </Box>

                {/* ── purchase summary ── */}
                <Box className="feedback-purchase-row">
                  <Box className="feedback-stat">
                    <Restaurant className="feedback-stat-icon" />
                    <Box>
                      <Typography className="feedback-stat-value">{saladsPurchased}</Typography>
                      <Typography className="feedback-stat-label">meals ordered</Typography>
                    </Box>
                  </Box>
                  <Box className="feedback-stat">
                    <EmojiEventsOutlined className="feedback-stat-icon" />
                    <Box>
                      <Typography className="feedback-stat-value">{points}</Typography>
                      <Typography className="feedback-stat-label">reward points</Typography>
                    </Box>
                  </Box>
                  <Box className="feedback-stat feedback-stat-meal">
                    <PersonOutlined className="feedback-stat-icon" />
                    <Box>
                      <Typography className="feedback-stat-value feedback-stat-meal-name">{lastMeal}</Typography>
                      <Typography className="feedback-stat-label">last viewed</Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography className="feedback-title">Share your feedback</Typography>
                <Typography className="feedback-subtitle">
                  Tell us what you think — every bit helps us get better.
                </Typography>

                {/* ── star rating ── */}
                <Box className="feedback-section">
                  <Typography className="feedback-label">Overall experience</Typography>
                  <Box className="feedback-stars">
                    {RATINGS.map((star) => (
                      <Box
                        key={star}
                        className="feedback-star"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => {
                          setRating(star);
                          setErrors((e) => ({ ...e, rating: undefined }));
                        }}
                        aria-label={`${star} star`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") setRating(star);
                        }}
                      >
                        {(hovered || rating) >= star ? (
                          <StarRounded className="star-filled" />
                        ) : (
                          <StarOutlineRounded className="star-empty" />
                        )}
                      </Box>
                    ))}
                  </Box>
                  {errors.rating && (
                    <Typography className="feedback-error">{errors.rating}</Typography>
                  )}
                </Box>

                {/* ── category ── */}
                <Box className="feedback-section">
                  <Typography className="feedback-label">What's this about?</Typography>
                  <RadioGroup
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setErrors((er) => ({ ...er, category: undefined }));
                    }}
                    className="feedback-radio-group"
                  >
                    {["Meal quality", "Delivery", "App experience", "Nutritionist", "Other"].map(
                      (opt) => (
                        <FormControlLabel
                          key={opt}
                          value={opt}
                          control={<Radio size="small" className="feedback-radio" />}
                          label={opt}
                          className={`feedback-radio-option ${category === opt ? "selected" : ""}`}
                        />
                      )
                    )}
                  </RadioGroup>
                  {errors.category && (
                    <Typography className="feedback-error">{errors.category}</Typography>
                  )}
                </Box>

                {/* ── message ── */}
                <Box className="feedback-section">
                  <Typography className="feedback-label">Your message</Typography>
                  <TextField
                    multiline
                    minRows={3}
                    maxRows={4}
                    placeholder="What went well? What could be better?"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setErrors((er) => ({ ...er, message: undefined }));
                    }}
                    error={Boolean(errors.message)}
                    helperText={errors.message}
                    fullWidth
                    className="feedback-textarea"
                  />
                </Box>

                <Button className="feedback-submit-btn" onClick={handleSubmit}>
                  Submit feedback
                </Button>

              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
