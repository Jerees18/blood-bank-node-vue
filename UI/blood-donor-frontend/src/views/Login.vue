<template>
  <div
    class="bg-light min-vh-100 d-flex align-items-center justify-content-center"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4 col-sm-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4">
              <!-- Header -->
              <div class="text-center mb-4">
                <h3 class="text-danger fw-bold">🩸 Blood Bank</h3>
                <p class="text-muted mb-0">Login to continue</p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    class="form-control form-control-lg"
                    placeholder="Enter your email"
                    v-model="email"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Enter your password"
                    v-model="password"
                    required
                  />
                </div>

                <button class="btn btn-danger btn-lg w-100 mt-2">
                  🔐 Login
                </button>

                <div v-if="errorMessage" class="text-danger mt-3 text-center fw-bold">{{ errorMessage }}</div>

                <p class="text-center mt-3 mb-0">
                  <router-link to="/forgot-password" class="text-muted text-decoration-none">
                    Forgot Password?
                  </router-link>
                </p>

                <!-- Register Link -->
                <p class="text-center mt-2 mb-0">
                  New User?
                  <router-link
                    to="/user-register"
                    class="text-danger fw-semibold text-decoration-none"
                  >
                    Register here
                  </router-link>
                </p>
              </form>
            </div>
          </div>

          <!-- Footer -->
          <p class="text-center text-muted mt-3 small">
            © 2026 Blood Bank Management System
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const router = useRouter();

const login = async () => {
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Email and password are required";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message || "Login failed";
      return;
    }

    //  Save login flag
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", "user");

    // Save user details
    localStorage.setItem("user", JSON.stringify(data.user));

    // Dispatch storage event for Navbar update
    window.dispatchEvent(new Event('storage'));

    //  Redirect to home
    router.push("/home");
  } catch (error) {
    errorMessage.value = "Server error. Try again later.";
    console.error(error);
  }
};
</script>
