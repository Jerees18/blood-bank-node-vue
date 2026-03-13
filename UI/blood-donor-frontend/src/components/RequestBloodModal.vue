<template>
  <div class="modal fade" id="requestBloodModal" tabindex="-1" aria-labelledby="requestBloodModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="sendRequest">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="requestBloodModalLabel">
              Request Blood from {{ targetName }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            
            <div class="mb-3">
              <label class="form-label text-muted">{{ isRequesterBloodBank ? 'Blood Bank Name' : 'Patient Name' }}</label>
              <input type="text" class="form-control" v-model="form.patientName" required />
            </div>

            <div class="mb-3">
              <label class="form-label text-muted">Required Blood Group</label>
              <select class="form-select" v-model="form.bloodGroup" :disabled="isFixedBloodGroup" required>
                <option value="" disabled>Select Blood Group</option>
                <option v-for="bg in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="bg" :value="bg">{{ bg }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label text-muted">Contact No</label>
              <input type="text" class="form-control" v-model="form.contactNumber" required />
            </div>

            <div class="mb-3">
              <label class="form-label text-muted">City</label>
              <select class="form-select" v-model="form.city" required>
                <option value="" disabled>Select city</option>
                <option v-for="city in TAMIL_NADU_CITIES" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label text-muted">{{ isRequesterBloodBank ? 'Blood Bank Location' : 'Hospital Location' }}</label>
              <input type="text" class="form-control" v-model="form.hospitalLocation" required />
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-danger" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ✉️ Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { TAMIL_NADU_CITIES } from '../constants/cities';

const props = defineProps({
  targetEntities: {
    type: Array,
    default: () => []
  },
  isDonor: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['request-sent']);

const targetName = ref('');
const isFixedBloodGroup = ref(false);
const loading = ref(false);
const isRequesterBloodBank = ref(false);
const requesterEmail = ref('');

onMounted(() => {
  const bankData = localStorage.getItem('bankData');
  const userData = localStorage.getItem('user');

  if (bankData) {
    isRequesterBloodBank.value = true;
    requesterEmail.value = JSON.parse(bankData).email;
  } else if (userData) {
    requesterEmail.value = JSON.parse(userData).email;
  }
});

const form = ref({
  patientName: '',
  bloodGroup: '',
  contactNumber: '',
  city: '',
  hospitalLocation: ''
});

// Watch for changes to the target entities to pre-fill the form
watch(() => props.targetEntities, (newTargets) => {
  if (newTargets && newTargets.length > 0) {
    if (newTargets.length === 1) {
      targetName.value = newTargets[0].name;
      // If requesting from a specific donor, lock the blood group to their blood type
      if (props.isDonor && newTargets[0].bloodGroup) {
        form.value.bloodGroup = newTargets[0].bloodGroup;
        isFixedBloodGroup.value = true;
      } else {
        form.value.bloodGroup = '';
        isFixedBloodGroup.value = false;
      }
    } else {
      // Bulk email mode (Request All Donors)
      targetName.value = `${newTargets.length} Donors`;
      form.value.bloodGroup = '';
      isFixedBloodGroup.value = false;
    }
  }
}, { deep: true });

const sendRequest = async () => {
  if (!props.targetEntities || props.targetEntities.length === 0) return;
  loading.value = true;

  const nameLabel = isRequesterBloodBank.value ? 'Blood Bank Name' : 'Patient Name';
  const locationLabel = isRequesterBloodBank.value ? 'Blood Bank Location' : 'Hospital Location';

  const emailMessage = `
    Urgent Blood Requirement!
    
    ${nameLabel}: ${form.value.patientName}
    City: ${form.value.city}
    ${locationLabel}: ${form.value.hospitalLocation}
    Contact Number: ${form.value.contactNumber}
    
    Please contact us immediately if you can assist.
  `;

  const payload = {
    donors: props.targetEntities, 
    message: emailMessage,
    bloodGroup: form.value.bloodGroup,
    city: form.value.city, 
    contact: form.value.contactNumber,
    isTargetBloodBank: !props.isDonor,
    requesterEmail: requesterEmail.value,
    requesterName: isRequesterBloodBank.value ? form.value.patientName : form.value.patientName
  };

  try {
    const response = await fetch("http://localhost:3000/api/mail/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (response.ok) {
      alert(`Request sent successfully to ${targetName.value}!`);
      emit('request-sent');
      // Hide modal
      const modalElement = document.getElementById('requestBloodModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      // Reset form
      form.value = {
        patientName: '',
        bloodGroup: '',
        contactNumber: '',
        city: '',
        hospitalLocation: ''
      };
    } else {
      alert("Failed to send request.");
    }
  } catch(err) {
    console.error(err);
    alert("Failed to send request.");
  } finally {
    loading.value = false;
  }
};
</script>
