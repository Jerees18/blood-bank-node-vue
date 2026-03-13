<template>
  <div class="bg-light min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4 col-sm-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h3 class="text-danger fw-bold">🔐 Forgot Password</h3>
                <p class="text-muted mb-0">Enter your email to receive a reset link</p>
              </div>

              <form @submit.prevent="submitReset">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    class="form-control form-control-lg"
                    placeholder="Enter your registered email"
                    v-model="email"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Account Type</label>
                  <select class="form-select form-select-lg" v-model="userType">
                    <option value="user">User / Donor</option>
                    <option value="blood_bank">Blood Bank</option>
                  </select>
                </div>

                <button class="btn btn-danger btn-lg w-100 mt-2" :disabled="loading">
                  {{ loading ? 'Sending...' : '📧 Send Reset Link' }}
                </button>

                <div v-if="message" class="alert mt-3 p-2 text-center" :class="isError ? 'alert-danger' : 'alert-success'">
                  {{ message }}
                </div>

                <p class="text-center mt-4 mb-0">
                  Remember your password?
                  <router-link to="/login" class="text-danger fw-semibold text-decoration-none">Login</router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const userType = ref("user");
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const submitReset = async () => {
  loading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const res = await fetch("http://localhost:3000/api/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, userType: userType.value }),
    });
    const data = await res.json();

    if (res.ok) {
      message.value = data.message || "Reset link sent! Check your email.";
      isError.value = false;
    } else {
      message.value = data.message || "Failed to send reset link.";
      isError.value = true;
    }
  } catch (err) {
    message.value = "Server error. Try again later.";
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
