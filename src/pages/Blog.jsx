import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Button, Card, CardContent, Chip } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Navbar from "./Navbar";
import { getCurrentUser } from "../utils/auth";

const POSTS = [
  {
    id: 1,
    tag: "NUTRITION",
    title: "Why protein matters more than you think",
    summary: "Protein isn't just for gym-goers. Here's how it keeps energy levels steady, supports recovery, and makes every meal more satisfying.",
    date: "Oct 12, 2026",
    readTime: "4 min read",
    color: "#fef3f5",
    accent: "#e58d9c",
  },
  {
    id: 2,
    tag: "MEAL PLANNING",
    title: "How to build a balanced lunch in under 10 minutes",
    summary: "A simple formula — protein, fibre, healthy fat — that works every day without needing a recipe or a lot of effort.",
    date: "Oct 6, 2026",
    readTime: "3 min read",
    color: "#f0faf4",
    accent: "#4caf7a",
  },
  {
    id: 3,
    tag: "LIFESTYLE",
    title: "The real reason you feel sluggish after lunch",
    summary: "It's not laziness — it's biology. Understanding the post-lunch dip and what you can eat to avoid it.",
    date: "Sep 28, 2026",
    readTime: "5 min read",
    color: "#fff8f0",
    accent: "#f4813a",
  },
  {
    id: 4,
    tag: "NUTRITION",
    title: "Plant protein vs animal protein — what actually matters",
    summary: "Both have their place. We break down what the research says and how to get enough from the meals you already enjoy.",
    date: "Sep 20, 2026",
    readTime: "6 min read",
    color: "#f5f0fb",
    accent: "#9c6fe4",
  },
  {
    id: 5,
    tag: "WELLNESS",
    title: "Eating for energy, not just for hunger",
    summary: "A shift in mindset that helps you make better choices — not by restricting, but by understanding what your body actually needs.",
    date: "Sep 14, 2026",
    readTime: "4 min read",
    color: "#e8f4fd",
    accent: "#4a9fd4",
  },
  {
    id: 6,
    tag: "MEAL PLANNING",
    title: "How meal subscriptions changed our customers' routines",
    summary: "Three real stories from people who stopped skipping lunch and started feeling better at work.",
    date: "Sep 7, 2026",
    readTime: "5 min read",
    color: "#fef3f5",
    accent: "#e58d9c",
  },
];

export default function Blog() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);
  const userName = currentUser?.name || localStorage.getItem("userName") || "Guest";

  return (
    <Box className="questionnaire-page blog-page">
      <div className="dashboard-header-shell">
        <Navbar isLoggedIn={isLoggedIn} userName={userName} />
      </div>

      <Box className="blog-container">

        {/* hero */}
        <motion.div
          className="blog-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typography className="blog-hero-kicker">THE FOOD, ACTUALLY BLOG</Typography>
          <Typography className="blog-hero-title">Nutrition made readable</Typography>
          <Typography className="blog-hero-subtitle">
            Simple, honest takes on food, health, and building better eating habits.
            No fads. No guilt. Just useful stuff.
          </Typography>
        </motion.div>

        {/* posts grid */}
        <Box className="blog-grid">
          {POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
            >
              <Card className="blog-card" style={{ background: post.color }}>
                <CardContent className="blog-card-content">
                  <Chip
                    label={post.tag}
                    size="small"
                    className="blog-tag"
                    style={{ borderColor: post.accent, color: post.accent }}
                  />
                  <Typography className="blog-card-title">{post.title}</Typography>
                  <Typography className="blog-card-summary">{post.summary}</Typography>
                  <Box className="blog-card-meta">
                    <Typography className="blog-meta-text">{post.date}</Typography>
                    <Typography className="blog-meta-dot">·</Typography>
                    <Typography className="blog-meta-text">{post.readTime}</Typography>
                  </Box>
                  <Button
                    className="blog-read-btn"
                    endIcon={<ArrowForward fontSize="small" />}
                    style={{ color: post.accent }}
                  >
                    Read article
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        <Button
          className="blog-back-btn"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
        >
          Back to home
        </Button>

      </Box>
    </Box>
  );
}
