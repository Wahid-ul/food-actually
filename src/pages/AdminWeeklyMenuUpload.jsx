import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CloudUpload } from "@mui/icons-material";
import { menuApi } from "../utils/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const MEAL_TYPES = ["lunch", "dinner"];

const AdminWeeklyMenuUpload = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [menuData, setMenuData] = useState({});

  const [error, setError] = useState("");

  const uploadImageMutation = useMutation({
    mutationFn: menuApi.uploadWeeklyMenuImage,
    onSuccess: (data) => {
      toast.success("Image uploaded successfully!");
    },
    onError: (err) => {
      setError("Failed to upload image: " + err.message);
      toast.error("Failed to upload image");
    },
  });

  const createWeeklyMenuItemMutation = useMutation({
    mutationFn: ({ day, mealType, data }) => {
      const payload = {
        day_of_week: day,
        meal_type: mealType,
        name: data.name,
        title_name: data.titleName || null,
        protein: data.protein || null,
        fiber: data.fiber || null,
        description: data.description || null,
        image_url: data.imageUrl,
      };
      console.log("Sending payload:", payload);
      return menuApi.createWeeklyMenuItem(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["weeklyMenuItems"]);
    },
    onError: (err) => {
      console.error("Upload error details:", err);
      setError("Failed to create menu item: " + err.message);
      toast.error("Failed to create menu item");
    },
  });

  const handleImageUpload = async (day, mealType, file) => {
    if (!file) return;

    const result = await uploadImageMutation.mutateAsync(file);
    const imageUrl = result.url;
    if (imageUrl) {
      setMenuData((prev) => ({
        ...prev,
        [`${day}-${mealType}`]: {
          ...prev[`${day}-${mealType}`],
          imageUrl,
        },
      }));
    }
  };

  const handleChange = (day, mealType, field, value) => {
    setMenuData((prev) => ({
      ...prev,
      [`${day}-${mealType}`]: {
        ...prev[`${day}-${mealType}`],
        [field]: value,
      },
    }));
  };

  const handleSubmitAll = async () => {
    const promises = [];
    const validItems = [];

    DAYS.forEach((day) => {
      MEAL_TYPES.forEach((mealType) => {
        const key = `${day}-${mealType}`;
        const data = menuData[key];

        // Only submit if image is uploaded and name is provided
        if (data && data.imageUrl && data.name) {
          validItems.push({ day, mealType, data });
          promises.push(
            createWeeklyMenuItemMutation.mutateAsync({
              day,
              mealType,
              data,
            })
          );
        }
      });
    });

    if (validItems.length === 0) {
      toast.error("Please upload at least one menu item with image and name");
      return;
    }

    try {
      await Promise.all(promises);
      toast.success(`Successfully uploaded ${validItems.length} menu item(s)!`);
      navigate("/");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload some menu items. Please check console for details.");
      toast.error("Failed to upload some menu items");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload This Week's Menu
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Add menu items for Monday to Friday (Lunch & Dinner)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {DAYS.map((day) => (
          <Accordion key={day} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{day}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {MEAL_TYPES.map((mealType) => {
                const key = `${day}-${mealType}`;
                const data = menuData[key] || {};

                return (
                  <Box
                    key={mealType}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                    }}
                  >
                    <Chip
                      label={mealType.toUpperCase()}
                      color="primary"
                      sx={{ mb: 2 }}
                    />

                    <Box
                      sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        p: 2,
                        textAlign: "center",
                        mb: 2,
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(day, mealType, e.target.files[0])
                        }
                        style={{ display: "none" }}
                        id={`image-${key}`}
                      />
                      <label htmlFor={`image-${key}`}>
                        <CloudUpload sx={{ fontSize: 32, color: "#667181" }} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {data.imageUrl ? "Image uploaded ✓" : "Click to upload image"}
                        </Typography>
                      </label>
                      {data.imageUrl && (
                        <img
                          src={data.imageUrl}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: 150,
                            marginTop: 10,
                            borderRadius: 4,
                          }}
                        />
                      )}
                    </Box>

                    <TextField
                      fullWidth
                      label="Name *"
                      value={data.name || ""}
                      onChange={(e) =>
                        handleChange(day, mealType, "name", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Title Name (Display Name)"
                      value={data.titleName || ""}
                      onChange={(e) =>
                        handleChange(day, mealType, "titleName", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Protein"
                      value={data.protein || ""}
                      onChange={(e) =>
                        handleChange(day, mealType, "protein", e.target.value)
                      }
                      placeholder="e.g., 30g"
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Fiber"
                      value={data.fiber || ""}
                      onChange={(e) =>
                        handleChange(day, mealType, "fiber", e.target.value)
                      }
                      placeholder="e.g., 6g"
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={2}
                      value={data.description || ""}
                      onChange={(e) =>
                        handleChange(day, mealType, "description", e.target.value)
                      }
                    />
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmitAll}
            disabled={createWeeklyMenuItemMutation.isPending}
            sx={{ flex: 1 }}
          >
            {createWeeklyMenuItemMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Upload All Menu Items"
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminWeeklyMenuUpload;
