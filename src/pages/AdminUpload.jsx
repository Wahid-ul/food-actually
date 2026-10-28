import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { menuApi } from "../utils/api";

const AdminUpload = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    titleName: "",
    badge: "",
    price: "",
    originalPrice: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    description: "",
    micronutrients: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const uploadImageMutation = useMutation({
    mutationFn: menuApi.uploadImage,
    onSuccess: (data) => {
      setImageUrl(data.url);
      setUploadingImage(false);
      setError("");
      toast.success("Image uploaded successfully!");
    },
    onError: (err) => {
      setError("Failed to upload image: " + err.message);
      setUploadingImage(false);
      toast.error("Failed to upload image");
    },
  });

  const createMenuItemMutation = useMutation({
    mutationFn: menuApi.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["menuItems"]);
      toast.success("Menu item created successfully!");
      navigate("/");
    },
    onError: (err) => {
      setError("Failed to create menu item: " + err.message);
      toast.error("Failed to create menu item");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setUploadingImage(true);
    uploadImageMutation.mutate(imageFile);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageUrl) {
      setError("Please upload an image first");
      return;
    }

    const menuItemData = {
      name: formData.name,
      title_name: formData.titleName || null,
      badge: formData.badge || null,
      price: parseInt(formData.price),
      original_price: formData.originalPrice ? parseInt(formData.originalPrice) : null,
      calories: formData.calories ? parseInt(formData.calories) : null,
      protein: formData.protein || null,
      carbs: formData.carbs || null,
      fat: formData.fat || null,
      fiber: formData.fiber || null,
      description: formData.description || null,
      micronutrients: formData.micronutrients || null,
      image_url: imageUrl,
    };

    createMenuItemMutation.mutate(menuItemData);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Menu Item
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload an image to Cloudinary and fill in the menu item details
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Image Upload
            </Typography>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#12284a",
                },
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <CloudUpload sx={{ fontSize: 48, color: "#667181" }} />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Click to select an image
                </Typography>
              </label>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
                />
                <Button
                  variant="contained"
                  onClick={handleUploadImage}
                  disabled={uploadingImage || imageUrl}
                  sx={{ mt: 2 }}
                >
                  {uploadingImage ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : imageUrl ? (
                    "Image Uploaded ✓"
                  ) : (
                    "Upload to Cloudinary"
                  )}
                </Button>
              </Box>
            )}
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
            <TextField
              fullWidth
              label="Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              label="Title Name (Display Name)"
              name="titleName"
              value={formData.titleName}
              onChange={handleChange}
              placeholder="e.g., Paneer Salad"
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              label="Badge"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="e.g., HIGH PROTEIN • CUSTOMER FAVORITE"
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              label="Price (₹) *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Original Price (₹)"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Calories"
              name="calories"
              type="number"
              value={formData.calories}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              placeholder="e.g., 30g"
            />

            <TextField
              fullWidth
              label="Carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              placeholder="e.g., 55g"
            />

            <TextField
              fullWidth
              label="Fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              placeholder="e.g., 8g"
            />

            <TextField
              fullWidth
              label="Fiber"
              name="fiber"
              value={formData.fiber}
              onChange={handleChange}
              placeholder="e.g., 6g"
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              label="Micronutrients"
              name="micronutrients"
              multiline
              rows={2}
              value={formData.micronutrients}
              onChange={handleChange}
              placeholder="e.g., Rich in protein, vitamin A, vitamin C, iron and potassium."
              sx={{ gridColumn: "span 2" }}
            />
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={createMenuItemMutation.isPending || !imageUrl}
              sx={{ flex: 1 }}
            >
              {createMenuItemMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Menu Item"
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
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminUpload;
