<template>
  <div>
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/products">Go to Products</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>