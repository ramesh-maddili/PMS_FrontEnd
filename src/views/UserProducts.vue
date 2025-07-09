<template>
  <div class="product-container">
    <!-- Admin Form to Add/Update Product -->
    <div v-if="role === 'Admin'" class="form-box sticky-form">
        <h2>📦 Product List</h2>
      <input ref="nameInput" v-model="newProduct.name" placeholder="Product Name" />
      <input v-model="newProduct.price" type="number" placeholder="Price (₹)" />
      <input v-model="newProduct.category" placeholder="Category" />

      <div class="button-group">
        <button v-if="!newProduct._id" @click="addProduct">Add Product</button>
        <button v-else @click="updateProduct">Update Product</button>
        <button class="cancel" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <!-- Product List -->
    <div v-for="product in products" :key="product._id" class="product-item">
      <p><strong>{{ product.name }}</strong> - ₹{{ product.price }} ({{ product.category }})</p>

      <div v-if="role === 'Admin'" class="action-buttons">
        <button class="edit" @click="editProduct(product)">Edit</button>
        <button class="delete" @click="deleteProduct(product._id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      products: [],
      newProduct: {
        name: '',
        price: '',
        category: ''
      },
      role: localStorage.getItem('role')
    }
  },
  created() {
    this.getProducts()
  },
  methods: {
    async getProducts() {
      const res = await axios.get('/products')
      this.products = res.data
    },
    async addProduct() {
      const name = this.newProduct.name
      await axios.post('/products', this.newProduct)
      alert(`✅ Product "${name}" added successfully!`)
      this.newProduct = { name: '', price: '', category: '' }
      this.getProducts()
    },
    async updateProduct() {
      if (!this.newProduct._id) return
      try {
        await axios.put(`/products/${this.newProduct._id}`, {
          name: this.newProduct.name,
          price: this.newProduct.price,
          category: this.newProduct.category
        })
        this.newProduct = { name: '', price: '', category: '' }
        this.getProducts()
        alert('✅ Product updated successfully!')
      } catch (err) {
        console.error("❌ Update failed:", err.response?.data?.message || err.message)
      }
    },
    async deleteProduct(id) {
      const deletedProduct = this.products.find(p => p._id === id)
      await axios.delete(`/products/${id}`)
      alert(`🗑️ Deleted "${deletedProduct?.name}"`)
      this.getProducts()
    },
    editProduct(product) {
  this.newProduct = { ...product }
  this.$nextTick(() => {
    this.$refs.nameInput?.focus()
  })
},

    cancelEdit() {
      this.newProduct = { name: '', price: '', category: '' }
    }
  }
}
</script>

<style scoped>
.sticky-form {
  position: sticky;
  top: 50px; /* adjust as per your navbar height */
  z-index: 1000;
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}


.product-container {
  max-width: 600px;
  margin: auto;
  background: #ffffff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-box input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.button-group {
  margin-top: 10px;
}

.button-group button,
.action-buttons button {
  margin-right: 10px;
  margin-top: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button {
  background-color: #2ecc71;
  color: white;
}

.cancel {
  background-color: #bdc3c7;
  color: #2c3e50;
}

.edit {
  background-color: #3498db;
  color: white;
}

.delete {
  background-color: #e74c3c;
  color: white;
}

.product-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.product-item p {
  margin: 0;
  font-size: 16px;
}
</style>
