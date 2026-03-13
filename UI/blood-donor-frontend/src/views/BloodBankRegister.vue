<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow border-0 mb-5">
          <div class="card-header bg-danger text-white">
            <h4 class="mb-0 text-center">Register New Blood Bank</h4>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Blood Bank Name</label>
                <input type="text" class="form-control" v-model="form.name" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" v-model="form.email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input type="text" class="form-control" v-model="form.phone" required />
              </div>
              <div class="mb-3">
                <label class="form-label">City</label>
                <select class="form-select" v-model="form.city" required>
                  <option value="" disabled>Select your city</option>
                  <option v-for="city in TAMIL_NADU_CITIES" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Location Details</label>
                <input type="text" class="form-control" v-model="form.location" required />
              </div>
              <div class="mb-4">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="form.password" required />
              </div>
              <button type="submit" class="btn btn-danger w-100">Register Blood Bank</button>
              
              <div v-if="error" class="text-danger mt-3 text-center fw-bold">{{ error }}</div>
              
              <p class="text-center mt-4 mb-0">
                Already registered?
                <router-link to="/blood-bank-login" class="text-danger fw-semibold text-decoration-none">
                  Login here
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
import { TAMIL_NADU_CITIES } from '../constants/cities';

const router = useRouter();
const form = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  location: '',
  password: ''
});
const error = ref(null);

const handleRegister = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/blood-banks/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    
    alert('Blood Bank registered successfully! Please login.');
    router.push('/blood-bank-login');
  } catch (err) {
    error.value = err.message;
  }
};
</script>
