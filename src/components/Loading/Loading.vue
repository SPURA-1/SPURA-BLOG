<template>
  <div class="loading">
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingPage'
};
</script>

<style scoped>
/* .loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(121, 118, 118, 0.3); 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
} */
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(31, 172, 219, 0.21);
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #4f6cec;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

p {
  margin-top: 20px;
  margin-left: 20px;
  color: #fff;
  font-size: 28px;
}
</style>
