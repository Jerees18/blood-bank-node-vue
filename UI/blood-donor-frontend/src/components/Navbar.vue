<template>
  <nav class="bg-white border-bottom shadow-sm">
    <div class="container">

      <ul class="nav nav-tabs justify-content-center pt-3">

        <!-- Public routes -->
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link
            to="/login"
            class="nav-link"
            active-class="active"
          >
            Login
          </router-link>
        </li>



       

        <li class="nav-item" v-if="isAuthenticated">
          <router-link
            to="/home"
            class="nav-link"
            active-class="active"
          >
            Donors
          </router-link>
        </li>

         <!-- Protected routes -->
        <li class="nav-item" v-if="isAuthenticated">
          <router-link
            to="/dashboard"
            class="nav-link"
            active-class="active"
            v-if="userType !== 'blood_bank'"
          >
            Dashboard
          </router-link>
        </li>

        <li class="nav-item" v-if="isAuthenticated">
          <router-link
            to="/blood-banks"
            class="nav-link"
            active-class="active"
          >
            Blood Banks
          </router-link>
        </li>

        <li class="nav-item" v-if="!isAuthenticated">
          <router-link
            to="/blood-bank-login"
            class="nav-link"
            active-class="active"
          >
            BB Login
          </router-link>
        </li>

        <li class="nav-item" v-if="isAuthenticated && userType === 'blood_bank'">
          <router-link
            to="/blood-bank/dashboard"
            class="nav-link"
            active-class="active"
          >
            BB Dashboard
          </router-link>
        </li>



      </ul>

    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");
const userType = ref(localStorage.getItem("userType"));

const updateAuthStatus = () => {
    isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
    userType.value = localStorage.getItem("userType");
};

onMounted(() => {
  window.addEventListener('storage', updateAuthStatus);
});
onUnmounted(() => {
  window.removeEventListener('storage', updateAuthStatus);
});

// Watch route changes to update auth state
watch(
  () => route.fullPath,
  () => {
    updateAuthStatus();
  }
);
</script>
