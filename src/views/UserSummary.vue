<template>
  <div class="summary-wrapper"><br/>
    <!-- Sticky Header -->
    <div class="summary-header">
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
    </div>

    <!-- Scrollable Summary Section -->
    <div class="summary-scroll">
      <div v-for="item in paginatedSummary" :key="item._id" class="summary-card">
        <h3>{{ item._id }}</h3>
        <ul>
          <li><strong>Total Products:</strong> {{ item.totalProducts }}</li>
          <li><strong>Average Price:</strong> ₹{{ item.avgPrice.toFixed(2) }}</li>
          <li><strong>Minimum Price:</strong> ₹{{ item.minPrice }}</li>
          <li><strong>Maximum Price:</strong> ₹{{ item.maxPrice }}</li>
        </ul>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">⏮ Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next ⏭</button>
      </div>
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
      currentPage: 1,
      perPage: 5, // Adjust how many cards per page
    };
  },
  computed: {
    role() {
      return localStorage.getItem("role");
    },
    totalPages() {
      return Math.ceil(this.summary.length / this.perPage);
    },
    paginatedSummary() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.summary.slice(start, start + this.perPage);
    },
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
        this.currentPage = 1; // Reset page on filter change
      } catch (err) {
        console.error("Summary fetch failed:", err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          this.$router.push("/login");
        }
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  }
};
</script>
<style scoped>
.summary-wrapper {
  max-width: 900px;
  margin: 30px auto;
  height: 90vh;
  background: linear-gradient(135deg, #f0f8ff, #e0f7fa);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
}

.summary-header {
  padding: 20px 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.summary-header h2 {
  margin: 0 0 15px;
  text-align: center;
  color: #2c3e50;
}

.filter-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-section label {
  font-weight: 600;
  font-size: 15px;
}

.filter-section select {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  font-size: 15px;
}

.summary-scroll {
  overflow-y: auto;
  padding: 20px 30px;
  flex-grow: 1;
}

.summary-card {
  background-color: #ffffff;
  border-left: 6px solid #3498db;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.summary-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  background-color: #f4fcff;
}

.summary-card h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  font-size: 20px;
}

.summary-card ul {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

.summary-card li {
  margin: 6px 0;
  font-size: 15px;
  color: #444;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  gap: 12px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>