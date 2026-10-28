import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem as MuiMenuItem,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, Restaurant, AccessTime, CalendarToday } from "@mui/icons-material";
import { menuApi } from "../utils/api";

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    mealType: "",
    deliveryDate: "",
    deliverySlot: "",
    preferredLocation: "",
    specialRequests: "",
  });

  const { data: menuItem, isLoading, error } = useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => menuApi.getMenuItem(id),
    enabled: !!id,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitBookingMutation = useMutation({
    mutationFn: () => {
      return menuApi.submitBooking({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        meal_name: displayItem.titleName,
        meal_type: "regular",
        delivery_date: formData.deliveryDate,
        delivery_slot: formData.deliverySlot,
        preferred_location: formData.preferredLocation,
        special_requests: formData.specialRequests,
      });
    },
    onSuccess: () => {
      setBookingSubmitted(true);
      toast.success("Booking request submitted successfully!");
    },
    onError: (err) => {
      console.error("Booking error:", err);
      toast.error("Failed to submit booking. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitBookingMutation.mutate();
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !menuItem) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Failed to load menu item details</Alert>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Menu
        </Button>
      </Container>
    );
  }

  if (bookingSubmitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#12284a" }}>
            Booking Request Submitted!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4, color: "#667181" }}>
            Thank you for your interest. A team member will connect with you soon to confirm your booking.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Back to Menu
          </Button>
        </Paper>
      </Container>
    );
  }

  const displayItem = {
    titleName: menuItem.title_name || menuItem.name,
    name: menuItem.name,
    image: menuItem.image_url,
    badge: menuItem.badge,
    price: menuItem.price,
    originalPrice: menuItem.original_price,
    calories: menuItem.calories,
    protein: menuItem.protein,
    carbs: menuItem.carbs,
    fat: menuItem.fat,
    fiber: menuItem.fiber,
    description: menuItem.description,
    micronutrients: menuItem.micronutrients,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Back to Menu
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Menu Item Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
            <Box
              component="img"
              src={displayItem.image}
              alt={displayItem.titleName}
              sx={{
                width: "100%",
                height: 300,
                objectFit: "cover",
                borderRadius: 2,
                mb: 3,
              }}
            />

            {displayItem.badge && (
              <Chip
                label={displayItem.badge}
                sx={{
                  mb: 2,
                  backgroundColor: "#12284a",
                  color: "white",
                }}
              />
            )}

            <Typography variant="h4" gutterBottom sx={{ color: "#12284a" }}>
              {displayItem.titleName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="h5" sx={{ color: "#e58d9c", fontWeight: "bold" }}>
                ₹{displayItem.price}
              </Typography>
              {displayItem.originalPrice && displayItem.originalPrice > displayItem.price && (
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through", color: "#999" }}
                >
                  ₹{displayItem.originalPrice}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#667181" }}>
              {displayItem.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Nutritional Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Restaurant sx={{ color: "#e58d9c" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Protein
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {displayItem.protein}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ color: "#e58d9c" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Calories
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {displayItem.calories} kcal
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Carbs
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {displayItem.carbs}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Fat
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {displayItem.fat}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Fiber
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {displayItem.fiber}
                </Typography>
              </Grid>
            </Grid>

            {displayItem.micronutrients && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Micronutrients
                </Typography>
                <Typography variant="body1" sx={{ color: "#667181" }}>
                  {displayItem.micronutrients}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Booking Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#12284a" }}>
              Book This Meal
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Fill in your details to book this meal in advance
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Your Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                select
                label="Meal Type *"
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              >
                <MuiMenuItem value="lunch">Lunch</MuiMenuItem>
                <MuiMenuItem value="dinner">Dinner</MuiMenuItem>
                <MuiMenuItem value="both">Lunch & Dinner</MuiMenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Delivery Date *"
                name="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: formData.deliveryDate ? true : undefined,
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                select
                label="Preferred Delivery Slot *"
                name="deliverySlot"
                value={formData.deliverySlot}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              >
                <MuiMenuItem value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</MuiMenuItem>
                <MuiMenuItem value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</MuiMenuItem>
                <MuiMenuItem value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</MuiMenuItem>
                <MuiMenuItem value="8:00 PM - 10:00 PM">8:00 PM - 10:00 PM</MuiMenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Preferred Location *"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleChange}
                required
                placeholder="Enter your delivery address"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Special Requests (Optional)"
                name="specialRequests"
                multiline
                rows={3}
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any dietary restrictions or preferences..."
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitBookingMutation.isPending}
                sx={{
                  backgroundColor: "#12284a",
                  "&:hover": {
                    backgroundColor: "#1a3a5e",
                  },
                }}
              >
                {submitBookingMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MenuItemDetail;
