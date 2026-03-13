<template>
  <div class="bg-light min-vh-100">
    <div class="container mt-5">
      <h2 class="text-center text-danger mb-4">🩸 Blood Donors</h2>

      <div class="card shadow-sm">
        <div class="card-body">
          <DonorTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import DonorTable from "./../components/DonorTable.vue";
</script>
