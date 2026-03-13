<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow border-0">
          <div class="card-header bg-danger text-white">
            <h4 class="mb-0 text-center">Blood Bank Admin Login</h4>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Blood Bank Email</label>
                <input type="email" class="form-control" v-model="email" required />
              </div>
              <div class="mb-4">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required />
              </div>
              <button type="submit" class="btn btn-danger w-100">Login to Dashboard</button>
              <div v-if="error" class="text-danger mt-3 text-center fw-bold">{{ error }}</div>
              
              <p class="text-center mt-3 mb-0">
                <router-link to="/forgot-password" class="text-muted text-decoration-none">
                  Forgot Password?
                </router-link>
              </p>

              <p class="text-center mt-2 mb-0">
                New Blood Bank?
                <router-link to="/blood-bank-register" class="text-danger fw-semibold text-decoration-none">
                  Register here
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref(null);

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/blood-banks/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', 'blood_bank');
    localStorage.setItem('bankData', JSON.stringify(data.bank));
    
    // Dispatch storage event manually for Navbar update
    window.dispatchEvent(new Event('storage'));
    
    router.push('/blood-bank/dashboard');
  } catch (err) {
    error.value = err.message;
  }
};
</script>
