<script setup>
import { ref } from 'vue';

const emit = defineEmits(['create']);

const adding = ref(false);
const name = ref('');

function submit() {
  if (!name.value.trim()) return;
  emit('create', name.value.trim());
  name.value = '';
  adding.value = false;
}
</script>

<template>
  <div class="add-list-column">
    <button v-if="!adding" class="add-list-btn" @click="adding = true">+ Agregar lista</button>

    <div v-else class="add-list-form">
      <input
        v-model="name"
        type="text"
        placeholder="Nombre de la lista"
        autofocus
        @keyup.enter="submit"
        @keyup.esc="adding = false"
      />
      <div class="add-list-form__actions">
        <button class="btn-primary" @click="submit">Agregar</button>
        <button class="btn-secondary" @click="adding = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>