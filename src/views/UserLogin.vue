<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="identifier" type="text" placeholder="Email or Username" required /><br />
        <input v-model="password" type="password" placeholder="Password" required /><br />
        <button>Login</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserLogin",
  data() {
    return {
      password: "",
      email: "",
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post("/login", {
          identifier: this.identifier,
          password: this.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("role", res.data.role);
        window.location.href = '/products';
      } catch (err) {
        this.error = "Invalid credentials";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f9fc;
}

.login-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1a242f;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
