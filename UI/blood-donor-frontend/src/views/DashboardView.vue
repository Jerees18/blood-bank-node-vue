<template>
  <div class="bg-light min-vh-100 py-5">
    <div class="container">

      <!-- Page Header -->
      <div class="text-center mb-4">
        <h2 class="text-danger fw-bold">📊 Dashboard</h2>
        <p class="text-muted">Welcome back!</p>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-6">

          <div class="card shadow border-0 rounded-4">
            <div class="card-body p-4">

              <!-- Avatar -->
              <div class="text-center mb-4">
                <div
                  class="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center"
                  style="width: 80px; height: 80px; font-size: 32px;"
                >
                  {{ userInitial }}
                </div>

                <h4 class="mt-3 mb-0">{{ user.name }}</h4>
                <small class="text-muted">{{ user.email }}</small>

                <span
                  v-if="user.isDonor"
                  class="badge bg-danger d-block mt-2"
                >
                  🩸 Blood Donor
                </span>
              </div>

              <hr />

              <!-- User Info -->
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  📞 <strong>Phone:</strong> {{ user.phone }}
                </li>
                <li class="list-group-item">
                  📍 <strong>City:</strong> {{ user.city || "Not set" }}
                </li>
                <li class="list-group-item" v-if="user.isDonor">
                  🩸 <strong>Blood Group:</strong>
                  {{ user.bloodGroup || "Not set" }}
                </li>
                <li class="list-group-item" v-if="user.isDonor">
                  ⚖️ <strong>Weight:</strong>
                  {{ user.weight ? user.weight + ' kg' : 'Not set' }}
                </li>
                <li class="list-group-item" v-if="user.isDonor">
                  ⏱️ <strong>Last Donated:</strong>
                  <span class="badge bg-secondary ms-1">{{ timeAgo(latestDonationDate) }}</span>
                  <button 
                    class="btn btn-sm btn-outline-danger float-end" 
                    @click="logSelfDonation" 
                    :disabled="loggingDonation || !canDonate(latestDonationDate)"
                    :title="!canDonate(latestDonationDate) ? 'You can only donate every 3 months' : ''"
                  >
                    {{ loggingDonation ? 'Updating...' : 'I Donated Today!' }}
                  </button>
                </li>
              </ul>

              <!-- Actions -->
              <div class="d-grid gap-2 mt-4">

                <button
                  v-if="!user.isDonor"
                  class="btn btn-danger"
                  @click="showDonorForm = true"
                >
                  🩸 Become a Donor
                </button>

                <button class="btn btn-outline-danger" @click="logout">
                  Logout
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Custom Donor Form Modal -->
    <div
      v-if="showDonorForm"
      class="custom-modal d-flex align-items-center justify-content-center"
    >
      <div class="modal-content p-4 rounded-4 shadow">

        <div class="modal-header d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0 text-danger">🩸 Become a Blood Donor</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="showDonorForm = false">✖</button>
        </div>

        <form @submit.prevent="submitDonor">

          <div class="mb-3">
            <label class="form-label">Blood Group</label>
            <select v-model="bloodGroup" class="form-select" required>
              <option value="">Select</option>
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Age</label>
            <input
              type="number"
              class="form-control"
              v-model="age"
              min="18"
              max="65"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">City</label>
            <select class="form-select" v-model="city" required>
              <option value="" disabled>Select your city</option>
              <option v-for="c in TAMIL_NADU_CITIES" :key="c" :value="c">
                {{ c }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Weight (kg)</label>
            <input
              type="number"
              class="form-control"
              v-model="weight"
              min="45"
              required
            />
            <small class="text-muted">Minimum 45 kg required</small>
          </div>

          <div class="mb-3">
            <label class="form-label d-block">Any Disease?</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="diseaseYes" value="yes" v-model="hasDisease" />
              <label class="form-check-label" for="diseaseYes">Yes</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="diseaseNo" value="no" v-model="hasDisease" />
              <label class="form-check-label" for="diseaseNo">No</label>
            </div>
            <div v-if="hasDisease === 'yes'" class="text-danger mt-2 fw-bold">
              ⚠️ You cannot become a donor if you have a disease.
            </div>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-danger" :disabled="hasDisease === 'yes' || Number(weight) < 45">Save & Become Donor</button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { TAMIL_NADU_CITIES } from "../constants/cities";

const router = useRouter();
const user = ref({});
const latestDonationDate = ref(null);

// Form state
const showDonorForm = ref(false);
const bloodGroup = ref("");
const age = ref("");
const city = ref("");
const weight = ref("");
const hasDisease = ref("no");



const loggingDonation = ref(false);
const logSelfDonation = async () => {
  if (!confirm("Are you sure you want to update your last donated date to today?")) return;
  
  loggingDonation.value = true;
  try {
    const res = await fetch("http://localhost:3000/api/history/self-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donor_id: user.value.id, blood_group: user.value.bloodGroup })
    });
    
    if (res.ok) {
       const data = await res.json();
       latestDonationDate.value = data.last_donated;
       user.value.last_donated = data.last_donated;
       localStorage.setItem("user", JSON.stringify(user.value));
       alert("Donation date updated successfully!");
    } else {
       throw new Error("Failed to update date");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating donation date.");
  } finally {
    loggingDonation.value = false;
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    router.push("/login");
  } else {
    user.value = JSON.parse(storedUser);
    if (user.value.isDonor) {
       latestDonationDate.value = user.value.last_donated;
    }
  }
});

const userInitial = computed(() =>
  user.value?.name ? user.value.name.charAt(0).toUpperCase() : "U"
);

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

const canDonate = (lastDonatedString) => {
  if (!lastDonatedString) return true;
  const lastDate = new Date(lastDonatedString);
  const diffTime = Math.abs(new Date() - lastDate);
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
  return diffMonths >= 3;
};

//  Become Donor API
const submitDonor = async () => {
  const payload = {
    email: user.value.email,
    bloodGroup: bloodGroup.value,
    age: age.value,
    city: city.value,
    weight: Number(weight.value),
    hasDisease: hasDisease.value === 'yes',
  };

  const res = await fetch("http://localhost:3000/api/users/become-donor", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  // Update UI + localStorage
  user.value = data.user;
  localStorage.setItem("user", JSON.stringify(data.user));

  // Hide custom modal
  showDonorForm.value = false;
};

const logout = () => {
  localStorage.clear();
  router.push("/login");
};
</script>

<style scoped>
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1050;
}
.modal-content {
  width: 100%;
  max-width: 450px;
  background: white;
}
</style>
