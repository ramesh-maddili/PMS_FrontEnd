<template>
  <div class="summary-container">
    <h2>📊 Product Summary by Category</h2>

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

    <div
      v-for="item in summary"
      :key="item._id"
      class="summary-card"
    >
      <h3>📁 {{ item._id }}</h3>
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
import axios from 'axios'

export default {
  data() {
    return {
      summary: [],
      selectedCategory: '',
      role: localStorage.getItem('role')
    }
  },
  created() {
    if (this.role === 'Admin') {
      this.getSummary()
    } else {
      this.$router.push('/products')
    }
  },
  methods: {
    async getSummary() {
      try {
        const url = this.selectedCategory
          ? `/summary?category=${this.selectedCategory}`
          : '/summary';
        const res = await axios.get(url);
        this.summary = res.data;
      } catch (err) {
        console.error('❌ Summary fetch failed:', err.message);
      }
    }
  }
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
  text-align: center;
}

.filter-section select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.summary-card {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 5px solid #3498db;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.summary-card h3 {
  margin-bottom: 10px;
  color: #34495e;
}

.summary-card ul {
  list-style: none;
  padding: 0;
}

.summary-card li {
  padding: 6px 0;
  font-size: 15px;
  color: #2c3e50;
}
</style>
