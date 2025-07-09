<template>
  <div id="app">
    <nav v-if="isAuthenticated">
      <router-link to="/products">Products</router-link>
      <router-link v-if="role === 'Admin'" to="/summary">Summary</router-link>

      <span class="spacer"></span>
      <span class="user-info">
       {{role}}
      </span>

      <button @click="logout">Logout</button>
    </nav>

    <!-- Only one router-view with key -->
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      role: localStorage.getItem('role')
    }
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token')
    }
  },
  watch: {
    // Watch route changes to update role dynamically
    '$route'() {
      this.role = localStorage.getItem('role')
    }
  },
  methods: {
    logout() {
      localStorage.clear()
      this.role = null
      this.$router.push('/login')
    }
  }
}
</script>

<style>

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  display: flex;
  align-items: center;
  background-color: #2c3e50;
  padding: 10px 20px;
  border-radius: 0; /* Remove radius if full width */
  position: fixed; /* Fix it to top */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

nav .spacer {
  flex-grow: 1;
}

.user-info {
  color: #ecf0f1;
  margin-right: 20px;
  font-weight: 500;
  background-color: #34495e;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}


nav a {
  color: white;
  margin-right: 20px;
  text-decoration: none;
  font-weight: bold;
}

nav a.router-link-exact-active {
  text-decoration: underline;
}

nav button {
  padding: 5px 10px;
  background: #e74c3c;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
