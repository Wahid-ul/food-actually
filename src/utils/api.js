const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async postFormData(endpoint, formData) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export const menuApi = {
  getMenuItems: () => apiClient.get("/menu/items"),
  getMenuItem: (id) => apiClient.get(`/menu/items/${id}`),
  getTrendingMeals: () => apiClient.get("/menu/trending"),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postFormData("/menu/upload_image", formData);
  },
  createMenuItem: (menuItem) => apiClient.post("/menu/admin_upload", menuItem),
  getWeeklyMenuItems: () => apiClient.get("/weekly-menu/items"),
  getWeeklyMenuItem: (id) => apiClient.get(`/weekly-menu/items/${id}`),
  uploadWeeklyMenuImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postFormData("/weekly-menu/upload_image", formData);
  },
  createWeeklyMenuItem: (menuItem) => apiClient.post("/weekly-menu/admin_upload", menuItem),
  submitBooking: (bookingData) => apiClient.post("/booking/submit", bookingData),
};
