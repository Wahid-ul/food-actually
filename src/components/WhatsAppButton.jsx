import React from "react";
import { motion } from "framer-motion";
import { Box, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/919477213246"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        textDecoration: "none",
      }}
      aria-label="Chat on WhatsApp"
    >
      <Tooltip title="Chat on WhatsApp" placement="left">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "#25D366",
            color: "white",
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.5)",
            transition: "background-color 0.3s",
            "&:hover": {
              backgroundColor: "#20BA5A",
            },
            cursor: "pointer",
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </Box>
      </Tooltip>
    </motion.a>
  );
};

export default WhatsAppButton;
