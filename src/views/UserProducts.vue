<template>
<div class="product-container"><br />
    <div v-if="role === 'Admin'" class="form-box sticky-form">
        <h2>Add / Update Product</h2>
        <input ref="nameInput" v-model="newProduct.name" placeholder="Product Name" />
        <input v-model="newProduct.price" type="number" placeholder="Price (₹)" />
        <input v-model="newProduct.category" placeholder="Category" />
        <div class="button-group">
            <button v-if="!newProduct._id" @click="addProduct">Add Product</button>
            <button v-else @click="updateProduct">Update</button>
            <button class="cancel" @click="cancelEdit">Cancel</button>
        </div>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <input type="text" v-model="searchText" @input="onSearchInput" placeholder="Search product..." class="search-input" />
    </div>
    <!-- Product Cards -->
    <div class="product-grid">
        <div v-for="product in filteredProducts" :key="product._id" class="product-card">
            <p><strong>{{ product.name }}</strong></p>
            <p>₹{{ product.price }} | {{ product.category }}</p>
            <div v-if="role === 'Admin'" class="action-buttons">
                <button class="edit" @click="editProduct(product)">Edit</button>
                <button class="delete" @click="deleteProduct(product._id)">Delete</button>
            </div>
        </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">⏮ Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next ⏭</button>
    </div>

</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      newProduct: { name: "", price: "", category: "" },
      currentPage: 1,
      perPage: 6,
      searchText: "",
      totalPages: 0
    };
  },
  computed: {
    role() {
      return localStorage.getItem("role");
    },
    filteredProducts() {
      const text = this.searchText.trim().toLowerCase();
      return this.products.filter(p => p.name.toLowerCase().includes(text));
    }
  },
  created() {
  const page = parseInt(this.$route.query.page) || 1;
  const search = this.$route.query.search || '';
  this.searchText = search;
  this.getProducts(page, search);
      this.updateFromRoute();
    },
watch: {
  '$route.query.search'(newSearch) {
    this.searchText = newSearch || '';
    this.getProducts(this.currentPage, newSearch);
    },
  '$route.query.page'(newPage) {
    const page = parseInt(newPage) || 1;
    this.currentPage = page;
    this.getProducts(page, this.searchText);
  }
},

  methods: {
  updateFromRoute() {
    const page = parseInt(this.$route.query.page) || 1;
    const search = this.$route.query.search || '';
    this.searchText = search;
    this.getProducts(page, search);
    
  },
  methods: {
  onSearchInput() {
    // On typing/searching — reset to page 1 with search query
    this.$router.push({
      path: '/products',
      query: { search: this.searchText, page: 1 }
    });
  }
  },
    async getProducts(page = 1, search ='') {
  try {
    const token = localStorage.getItem("token");
        //const currentQueryPage = parseInt(this.$route.query.page) || 1;
    // if (currentQueryPage !== page) {
    //   this.$router.push({ path: "/products", query: { page } });
    // }
    const res = await axios.get(`/products/getall?page=${page}&search=${search}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.products = res.data.data;
    this.totalPages = res.data.totalPages;
    this.currentPage = res.data.currentPage;

  } catch (err) {
    console.error("Get products failed:", err.response?.data?.message || err.message);
    if (err.response?.status === 401) {
      alert("Unauthorized. Please log in again.");
    }
  }
  },

    async addProduct() {
      const { name, price, category } = this.newProduct;
      const token = localStorage.getItem("token");

      if (!name || !price || !category) {
        alert("Please fill all fields before adding a product.");
        return;
      }

      try {
        await axios.post("/products/create", this.newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert(`Product "${name}" added successfully!`);
        this.newProduct = { name: "", price: "", category: "" };
        this.getProducts();
      } catch (err) {
        console.error("Add failed:", err.response?.data?.message || err.message);
      }
    },

    async updateProduct() {
      if (!this.newProduct._id) return;
      const token = localStorage.getItem("token");

      try {
        await axios.put(
          `/products/${this.newProduct._id}`,
          {
            name: this.newProduct.name,
            price: this.newProduct.price,
            category: this.newProduct.category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Product updated successfully!");
        this.newProduct = { name: "", price: "", category: "" };
        this.getProducts();
      } catch (err) {
        console.error("Update failed:", err.response?.data?.message || err.message);
      }
    },

    async deleteProduct(id) {
      const token = localStorage.getItem("token");
      const deletedProduct = this.products.find((p) => p._id === id);

      try {
        await axios.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert(`Deleted "${deletedProduct?.name}"`);
        this.getProducts();
      } catch (err) {
        console.error("Delete failed:", err.response?.data?.message || err.message);
      }
    },

    editProduct(product) {
      this.newProduct = { ...product };
      this.$nextTick(() => {
        this.$refs.nameInput?.focus();
      });
    },

    cancelEdit() {
      this.newProduct = { name: "", price: "", category: "" };
    },

    nextPage() {
    if (this.currentPage < this.totalPages) {
      this.$router.push({
        path: '/products',
        query: { page: this.currentPage + 1, search: this.searchText }
      });
    }
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.$router.push({
        path: '/products',
        query: { page: this.currentPage - 1, search: this.searchText }
      });
    }
  },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.product-container {
    max-width: 900px;
    margin: auto;
    background: #fdfdfd;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #2c3e50;
    margin-bottom: 15px;
}

.form-box input {
    width: 100%;
    padding: 10px;
    margin-top: 8px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 15px;
}

.button-group button,
.action-buttons button,
.pagination button {
    margin-right: 10px;
    padding: 8px 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
}

button {
    background-color: #27ae60;
    color: white;
}

button:hover {
    background-color: #219150;
}

.cancel {
    background-color: #95a5a6;
}

.edit {
    background-color: #3498db;
}

.delete {
    background-color: #e74c3c;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.product-card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
    transition: transform 0.3s;
}

.product-card:hover {
    transform: translateY(-4px);
}

.product-card p {
    margin: 6px 0;
}

.pagination {
    text-align: center;
    margin-top: 20px;
}

.pagination button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.search-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 240px;
    transition: border-color 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #3498db;
}
</style>
