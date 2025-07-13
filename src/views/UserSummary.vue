<template>
  <div class="summary-container">
    <h2>Product Summary by Category</h2>

    <div class="filter-section">
      <label for="category">Filter by Category: </label>
      <select v-model="selectedCategory" @change="getSummary">
        <option value="">None (All Categories)</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Laptop">Laptop</option>
        <option value="Accessories">Accessories</option>
        <option value="Footwear">Footwear</option>
      </select>
    </div>

    <div v-for="item in summary" :key="item._id" class="summary-card">
      <h3>{{ item._id }}</h3>
      <ul>
        <li><strong>Total Products:</strong> {{ item.totalProducts }}</li>
        <li><strong>Average Price:</strong> ₹{{ item.avgPrice.toFixed(2) }}</li>
        <li><strong>Minimum Price:</strong> ₹{{ item.minPrice }}</li>
        <li><strong>Maximum Price:</strong> ₹{{ item.maxPrice }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      summary: [],
      selectedCategory: "",
    };
  },
  computed: {
    role() {
      return localStorage.getItem("role");
    },
  },
  created() {
    if (this.role === "Admin") {
      this.getSummary();
    } else {
      this.$router.push("/products");
    }
  },
  methods: {
    async getSummary() {
      try {
        const token = localStorage.getItem("token");
        const url = this.selectedCategory
          ? `/summary?category=${this.selectedCategory}`
          : "/summary";

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.summary = res.data;
      } catch (err) {
        console.error(
          "Summary fetch failed:",
          err.response?.data?.message || err.message
        );
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>
