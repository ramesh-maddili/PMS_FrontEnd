<template>
  <div class="register-container">
    <div class="register-box">
      <img src="@/assets/Coromandel.png" alt="Logo" class="logo" />
      <h2>Create Your Account</h2>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Username" required />
        <input v-model="email" placeholder="Email" type="email" required />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <p v-if="password && !isPasswordStrong" class="validation-error">
          Password must be at least 8 characters long, contain an uppercase
          letter, a lowercase letter, a number, and a special character.
        </p>

        <select v-model="role">
          <option>User</option>
          <option>Admin</option>
        </select>

        <button :disabled="!isPasswordStrong">Register</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      role: 'User',
      error: ''
    };
  },
  computed: {
    isPasswordStrong() {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|\\:'",.<>?]).{8,}$/;
      return regex.test(this.password);
    }
  },
  methods: {
    async register() {
      try {
        const res = await axios.post('/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        });
        alert(res.data.message || 'Registration successful');
        this.$router.push('/login');
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #74ebd5, #acb6e5);
  
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

.register-box h2 {
  margin-bottom: 20px;
  color: #34495e;
}

input,
select {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9f9f9;
}

input:focus,
select:focus {
  border-color: #3498db;
  background-color: #fff;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 15px;
}

button:hover:enabled {
  background-color: #2c80b4;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.validation-error {
  color: #e74c3c;
  font-size: 13px;
  margin-top: -5px;
  text-align: left;
}
</style>
