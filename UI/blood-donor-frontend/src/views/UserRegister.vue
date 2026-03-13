<template>
  <div class="bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="card shadow">
            <div class="card-body">
              <h4 class="text-center mb-4">👤 User Registration</h4>

              <form @submit.prevent="registerUser">
                <!-- Username -->
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.username"
                    required
                  />
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="form.email"
                    required
                  />
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="form.password"
                    required
                  />
                </div>

                <!-- Phone -->
                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.phone"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">City</label>
                  <select v-model="form.city" class="form-select" required>
                    <option value="" disabled>Select your city</option>
                    <option v-for="city in TAMIL_NADU_CITIES" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>

                <button class="btn btn-primary w-100">Register</button>

                <div v-if="error" class="text-danger mt-3 text-center fw-bold">{{ error }}</div>
                <div v-if="success" class="text-success mt-3 text-center fw-bold">{{ success }}</div>
              </form>

              <p class="text-center mt-3">
                Already registered?
                <router-link to="/" class="text-primary"> Login </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { TAMIL_NADU_CITIES } from "../constants/cities";

const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  password: "",
  phone: "",
  city:"",
});

const error = ref("");
const success = ref("");

const registerUser = async () => {
  error.value = "";
  success.value = "";

  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/register",
      form
    );

    success.value = response.data.message;

    // Optional redirect after success
    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (err) {
    error.value = err.response?.data?.message || "Registration failed";
  }
};
</script>
