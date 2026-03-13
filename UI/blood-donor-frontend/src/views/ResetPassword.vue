<template>
  <div class="bg-light min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4 col-sm-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h3 class="text-danger fw-bold">🔑 Reset Password</h3>
                <p class="text-muted mb-0">Enter your new password below</p>
              </div>

              <div v-if="!tokenValid" class="text-center">
                <div class="alert alert-danger">Invalid or missing reset link. Please request a new one.</div>
                <router-link to="/forgot-password" class="btn btn-outline-danger">Request New Link</router-link>
              </div>

              <form v-else @submit.prevent="submitNewPassword">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    class="form-control form-control-lg"
                    :value="email"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">New Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Enter new password"
                    v-model="newPassword"
                    required
                    minlength="3"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Confirm new password"
                    v-model="confirmPassword"
                    required
                  />
                </div>

                <div v-if="newPassword && confirmPassword && newPassword !== confirmPassword" class="text-danger small mb-2">
                  ⚠️ Passwords do not match
                </div>

                <button
                  class="btn btn-danger btn-lg w-100 mt-2"
                  :disabled="loading || !newPassword || !confirmPassword || newPassword !== confirmPassword"
                >
                  {{ loading ? 'Resetting...' : '✅ Reset Password' }}
                </button>

                <div v-if="message" class="alert mt-3 p-2 text-center" :class="isError ? 'alert-danger' : 'alert-success'">
                  {{ message }}
                </div>

                <p v-if="resetSuccess" class="text-center mt-3">
                  <router-link to="/login" class="btn btn-outline-danger">Go to Login</router-link>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const email = ref("");
const token = ref("");
const userType = ref("user");
const tokenValid = ref(false);

const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const message = ref("");
const isError = ref(false);
const resetSuccess = ref(false);

onMounted(() => {
  email.value = route.query.email || "";
  token.value = route.query.token || "";
  userType.value = route.query.type || "user";
  tokenValid.value = !!(email.value && token.value);
});

const submitNewPassword = async () => {
  if (newPassword.value !== confirmPassword.value) return;

  loading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const res = await fetch("http://localhost:3000/api/password-reset/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        token: token.value,
        newPassword: newPassword.value,
        userType: userType.value,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      message.value = data.message || "Password reset successfully!";
      isError.value = false;
      resetSuccess.value = true;
    } else {
      message.value = data.message || "Reset failed.";
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
