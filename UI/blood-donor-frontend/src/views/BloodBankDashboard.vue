<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
      <h2 class="text-danger m-0">{{ bankData?.name }} <span class="text-muted fs-4">| Admin Dashboard</span></h2>
      <button class="btn btn-outline-danger" @click="logout"><i class="bi bi-box-arrow-right"></i> Logout Blood Bank</button>
    </div>

    <div class="row">
      <!-- Update Stock Section -->
      <div class="col-md-5">
        <div class="card shadow-sm mb-4 border-0">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0">Add Blood Stock</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateStock">
              <div class="mb-3">
                <label class="form-label text-muted">Blood Group</label>
                <select class="form-select" v-model="stockForm.blood_group" required>
                  <option value="" disabled>Select Group</option>
                  <option v-for="bg in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="bg" :value="bg">{{ bg }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Quantity to Add (ml)</label>
                <input type="number" class="form-control" v-model="stockForm.quantity_ml" required>
              </div>
              <button type="submit" class="btn btn-danger w-100">Update Inventory</button>
              <div v-if="stockMsg" class="alert alert-success mt-3 p-2 text-center">{{ stockMsg }}</div>
            </form>
          </div>
        </div>

        <!-- Log a Donation Section -->
        <div class="card shadow-sm mb-4 border-0">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0">📋 Log a Donation</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="logDonation">
              <div class="mb-3">
                <label class="form-label text-muted">Donor Name</label>
                <select class="form-select" v-model="donationForm.donor_id" required @change="onDonorSelect">
                  <option value="" disabled>Select a registered donor</option>
                  <option 
                    v-for="donor in donors" 
                    :key="donor.id" 
                    :value="donor.id"
                    :disabled="!canDonate(donor.last_donated)"
                  >
                    {{ donor.name }} ({{ donor.bloodGroup }} - {{ donor.city }}) — {{ donorLastDonatedLabel(donor.last_donated) }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Blood Group</label>
                <select class="form-select" v-model="donationForm.blood_group" required disabled>
                  <option value="" disabled>Auto-filled from donor</option>
                  <option v-for="bg in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="bg" :value="bg">{{ bg }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Quantity (ml)</label>
                <input type="number" class="form-control" v-model="donationForm.quantity_ml" min="100" required />
              </div>
              <button type="submit" class="btn btn-danger w-100" :disabled="donationLoading">
                <span v-if="donationLoading" class="spinner-border spinner-border-sm me-2"></span>
                Log Donation
              </button>
              <div v-if="donationMsg" class="alert mt-3 p-2 text-center" :class="donationMsgType === 'success' ? 'alert-success' : 'alert-danger'">{{ donationMsg }}</div>
            </form>
          </div>
        </div>
      </div>

      <!-- Current Stock -->
      <div class="col-md-7">
        <div class="card shadow-sm mb-4 border-0">
          <div class="card-header bg-white border-bottom border-danger border-2">
            <h5 class="mb-0 text-danger">Current Inventory</h5>
          </div>
          <div class="card-body">
            <div class="row text-center g-3 mt-1">
              <div v-for="stock in myStocks" :key="stock.blood_group" class="col-4 col-md-3">
                 <div class="p-3 border rounded shadow-sm bg-light">
                    <h3 class="text-danger mb-1">{{ stock.blood_group }}</h3>
                    <span class="fw-bold">{{ stock.quantity_ml }}</span> <small class="text-muted">ml</small>
                 </div>
              </div>
              <div v-if="myStocks.length === 0" class="col-12 text-muted mt-3">No stock matching this blood bank found in database.</div>
            </div>
          </div>
        </div>

        <!-- Recent Donation History -->
        <div class="card shadow-sm mb-4 border-0">
          <div class="card-header bg-white border-bottom border-danger border-2">
            <h5 class="mb-0 text-danger">📜 Recent Donation History</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Donor Name</th>
                    <th>Blood Group</th>
                    <th>Quantity (ml)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(record, index) in donationHistory" :key="record.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ record.donor_name }}</td>
                    <td><span class="badge bg-danger">{{ record.blood_group }}</span></td>
                    <td>{{ record.quantity_ml }} ml</td>
                    <td>{{ formatDate(record.donation_date) }}</td>
                  </tr>
                  <tr v-if="donationHistory.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">No donation history yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const bankData = ref(null);
const myStocks = ref([]);
const stockForm = ref({ blood_group: '', quantity_ml: '' });
const stockMsg = ref('');

// Donation form state
const donors = ref([]);
const donationForm = ref({ donor_id: '', blood_group: '', quantity_ml: '' });
const donationLoading = ref(false);
const donationMsg = ref('');
const donationMsgType = ref('success');

// Donation history
const donationHistory = ref([]);

onMounted(() => {
  const data = localStorage.getItem('bankData');
  if (!data) {
    router.push('/blood-bank-login');
    return;
  }
  bankData.value = JSON.parse(data);
  fetchStocks();
  fetchDonors();
  fetchHistory();
});

const fetchStocks = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/blood-stocks?blood_bank_id=${bankData.value.id}`);
    if (res.ok) {
      myStocks.value = await res.json();
    }
  } catch(err) {
    console.error(err);
  }
};

const fetchDonors = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/listuser/donors');
    if (res.ok) {
      donors.value = await res.json();
    }
  } catch(err) {
    console.error(err);
  }
};

const fetchHistory = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/history?blood_bank_id=${bankData.value.id}`);
    if (res.ok) {
      donationHistory.value = await res.json();
    }
  } catch(err) {
    console.error(err);
  }
};

const onDonorSelect = () => {
  const selected = donors.value.find(d => d.id === donationForm.value.donor_id);
  if (selected) {
    donationForm.value.blood_group = selected.bloodGroup;
  }
};

const canDonate = (lastDonatedStr) => {
  if (!lastDonatedStr) return true;
  const diffTime = Math.abs(new Date() - new Date(lastDonatedStr));
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
  return diffMonths >= 3;
};

const donorLastDonatedLabel = (lastDonatedStr) => {
  if (!lastDonatedStr) return 'Never donated';
  const d = new Date(lastDonatedStr);
  const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  if (!canDonate(lastDonatedStr)) {
    return `Last: ${label} (Not eligible)`;
  }
  return `Last: ${label}`;
};

const updateStock = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/blood-stocks/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blood_bank_id: bankData.value.id,
        blood_group: stockForm.value.blood_group,
        quantity_ml: stockForm.value.quantity_ml
      })
    });
    if (res.ok) {
      stockMsg.value = 'Stock updated successfully!';
      stockForm.value.quantity_ml = '';
      fetchStocks();
      setTimeout(()=> stockMsg.value='', 3000);
    }
  } catch(err) {
    console.error(err);
  }
};

const logDonation = async () => {
  donationLoading.value = true;
  donationMsg.value = '';
  try {
    const res = await fetch('http://localhost:3000/api/history/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donor_id: donationForm.value.donor_id,
        blood_bank_id: bankData.value.id,
        blood_group: donationForm.value.blood_group,
        quantity_ml: Number(donationForm.value.quantity_ml)
      })
    });
    const data = await res.json();
    if (res.ok) {
      donationMsg.value = 'Donation logged successfully! Stock updated.';
      donationMsgType.value = 'success';
      donationForm.value = { donor_id: '', blood_group: '', quantity_ml: '' };
      fetchStocks();
      fetchHistory();
      setTimeout(() => donationMsg.value = '', 4000);
    } else {
      donationMsg.value = data.message || 'Failed to log donation.';
      donationMsgType.value = 'error';
    }
  } catch(err) {
    console.error(err);
    donationMsg.value = 'Failed to log donation.';
    donationMsgType.value = 'error';
  } finally {
    donationLoading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const logout = () => {
  localStorage.clear();
  window.dispatchEvent(new Event('storage'));
  router.push('/blood-bank-login');
};
</script>
