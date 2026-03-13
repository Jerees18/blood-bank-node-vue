<template>
  <div>
    <!-- Filters + Request All -->
    <div class="row mb-4 align-items-end">
      <div class="col-md-4">
        <label class="form-label">City</label>
        <select class="form-select" v-model="selectedCity">
          <option value="">All Cities</option>
          <option v-for="city in cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Blood Group</label>
        <select class="form-select" v-model="selectedBloodGroup">
          <option value="">All Blood Groups</option>
          <option v-for="bg in bloodGroups" :key="bg" :value="bg">
            {{ bg }}
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <button
          class="btn btn-danger w-100"
          :disabled="!filteredDonors.length"
          @click="requestAll"
        >
          📧 Request All Donors
        </button>
      </div>
    </div>

    <!-- Donor Cards -->
    <div class="row g-4" v-if="filteredDonors.length">
      <div class="col-md-4" v-for="donor in filteredDonors" :key="donor.phone">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-danger text-white text-center">
            <h5 class="mb-0">{{ donor.name }}</h5>
          </div>

          <div class="card-body">
            <p class="mb-2"><strong>🩸 Blood Group:</strong> {{ donor.bloodGroup }}</p>
            <p class="mb-2"><strong>🎂 Age:</strong> {{ donor.age }}</p>
            <p class="mb-2"><strong>📍 City:</strong> {{ donor.city }}</p>
            <p class="mb-2"><strong>📞 Phone:</strong> {{ donor.phone }}</p>
            <p class="mb-0">
              <strong>⏱️ Last Donated:</strong> 
              <span class="badge bg-secondary ms-1">{{ timeAgo(donor.last_donated) }}</span>
            </p>
            <p v-if="!canDonate(donor.last_donated)" class="mb-0 mt-2 text-danger small fw-bold">
              ⚠️ Cannot donate! (Less than 3 months)
            </p>
          </div>

          <div class="card-footer text-center">
            <button class="btn btn-outline-danger btn-sm" :disabled="!canDonate(donor.last_donated)" @click="openRequestModal(donor)">
              {{ canDonate(donor.last_donated) ? 'Request Blood' : 'Ineligible' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-muted mt-4">No donors available</p>

    <!-- Reusable Request Modal -->
    <RequestBloodModal :targetEntities="selectedDonors" :isDonor="true" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import RequestBloodModal from './RequestBloodModal.vue';

const donors = ref([]);
const selectedCity = ref("");
const selectedBloodGroup = ref("");
const currentUser = ref(null);

const selectedDonors = ref([]);

const getAllBloodDonors = async () => {
  const res = await fetch("http://localhost:3000/api/listuser/donors");
  donors.value = await res.json();
};

const timeAgo = (dateString) => {
  if (!dateString) return "Never Donated";
  const diffTime = Math.abs(new Date() - new Date(dateString));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  if (diffDays === 0) return "Today";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return `${Math.floor(diffMonths / 12)} years ago`;
};

const canDonate = (dateString) => {
  if (!dateString) return true;
  const diffTime = Math.abs(new Date() - new Date(dateString));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 90; // Approx 3 months
};

onMounted(() => {
  getAllBloodDonors();

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  }
});

const cities = computed(() => [
  ...new Set(donors.value.map((d) => d.city)),
]);

const bloodGroups = computed(() => [
  ...new Set(donors.value.map((d) => d.bloodGroup)),
]);

const filteredDonors = computed(() =>
  donors.value.filter((donor) => {
    if (
      currentUser.value &&
      donor.email === currentUser.value.email
    ) {
      return false;
    }

    const cityMatch =
      !selectedCity.value || donor.city === selectedCity.value;

    const bloodMatch =
      !selectedBloodGroup.value ||
      donor.bloodGroup === selectedBloodGroup.value;

    return cityMatch && bloodMatch;
  })
);

const requestAll = async () => {
  const eligibleDonors = filteredDonors.value.filter(d => canDonate(d.last_donated));
  if (!eligibleDonors.length) {
     alert("No eligible donors found matching your criteria.");
     return;
  }

  // Open modal with all eligible donors
  selectedDonors.value = eligibleDonors;
  const modalElement = document.getElementById('requestBloodModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

const openRequestModal = (donor) => {
  selectedDonors.value = [donor];
  const modalElement = document.getElementById('requestBloodModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};
</script>
