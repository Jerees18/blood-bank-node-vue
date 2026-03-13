<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-danger mb-0">Blood Banks & Available Stock</h2>
      <button 
        class="btn btn-danger" 
        :disabled="!bloodBanks.length"
        @click="requestAllBanks"
      >
        📧 Request All Blood Banks
      </button>
    </div>
    
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    
    <div class="row" v-if="!loading && !error">
      <div class="col-md-6 mb-4" v-for="bank in bloodBanks" :key="bank.id">
        <div class="card shadow-sm h-100 border-0 border-top border-danger border-4">
          <div class="card-body">
            <h5 class="card-title text-primary"><i class="bi bi-hospital me-2"></i>{{ bank.name }}</h5>
            <p class="card-text mb-1"><strong>City:</strong> {{ bank.city }}</p>
            <p class="card-text mb-1"><strong>Location:</strong> {{ bank.location }}</p>
            <p class="card-text mb-3"><strong>Phone:</strong> {{ bank.phone }}</p>
            
            <h6 class="text-muted border-bottom pb-2 mt-3">Available Blood Stock</h6>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <div v-for="stock in getBankStock(bank.id)" :key="stock.blood_group" class="badge bg-danger p-2 fs-6">
                {{ stock.blood_group }}: {{ stock.quantity_ml }} ml
              </div>
              <div v-if="getBankStock(bank.id).length === 0" class="text-muted small">
                No stock data available.
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-top-0 text-center pb-3">
            <button class="btn btn-outline-danger w-100" :disabled="!hasBankStock(bank.id)" @click="openRequestModal(bank)">
              <i class="bi bi-envelope me-1"></i> Request Blood
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reusable Request Modal -->
    <RequestBloodModal :targetEntities="selectedBanks" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RequestBloodModal from '../components/RequestBloodModal.vue';

const bloodBanks = ref([]);
const stocks = ref([]);
const loading = ref(true);
const error = ref(null);

const selectedBanks = ref([]);

const fetchData = async () => {
  try {
    const [banksRes, stocksRes] = await Promise.all([
      fetch('http://localhost:3000/api/blood-banks'),
      fetch('http://localhost:3000/api/blood-stocks')
    ]);
    if (!banksRes.ok || !stocksRes.ok) throw new Error('Failed to fetch data');
    
    let fetchedBanks = await banksRes.json();
    
    // Filter out the currently logged-in blood bank
    const storedBankData = localStorage.getItem('bankData');
    if (storedBankData) {
      const loggedInBank = JSON.parse(storedBankData);
      fetchedBanks = fetchedBanks.filter(bank => bank.id !== loggedInBank.id);
    }
    
    bloodBanks.value = fetchedBanks;
    stocks.value = await stocksRes.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const getBankStock = (bankId) => {
  return stocks.value.filter(s => s.blood_bank_id === bankId);
};

const hasBankStock = (bankId) => {
  const bankStocks = getBankStock(bankId);
  return bankStocks.some(s => s.quantity_ml > 0);
};

const openRequestModal = (bank) => {
  selectedBanks.value = [bank];
  const modalElement = document.getElementById('requestBloodModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

const requestAllBanks = () => {
  if (!bloodBanks.value.length) return;
  
  // Pass all loaded blood banks to the modal
  selectedBanks.value = bloodBanks.value;
  const modalElement = document.getElementById('requestBloodModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};

onMounted(fetchData);
</script>
