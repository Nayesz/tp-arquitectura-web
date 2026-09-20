<template>
  <div class="board-selector">
    <h1>Elegí un tablero</h1>

    <div v-if="boards.length" class="board-grid">
      <button v-for="board in boards" :key="board.id" class="board-card" @click="emit('select', board)">
        <div class="board-card__name">{{ board.name }}</div>
        <div v-if="board.description" class="board-card__desc">{{ board.description }}</div>
      </button>
    </div>
    <p v-else class="empty-msg">Todavía no hay ningún tablero. Creá el primero.</p>

    <div v-if="!creating" class="board-selector__actions">
      <button class="btn-primary" @click="creating = true">+ Nuevo tablero</button>
    </div>

    <div v-else class="new-board-form">
      <div class="field">
        <label for="new-board-name">Nombre *</label>
        <input id="new-board-name" v-model="newName" type="text" placeholder="Nombre del tablero" />
      </div>
      <div class="field">
        <label for="new-board-desc">Descripción</label>
        <input id="new-board-desc" v-model="newDescription" type="text" placeholder="Descripción (opcional)" />
      </div>
      <div class="board-selector__actions">
        <button class="btn-secondary" @click="creating = false">Cancelar</button>
        <button class="btn-primary"  :disabled="isButtonDisabled" @click="submitCreate">Crear tablero</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref,computed } from 'vue';

defineProps({
  boards: { type: Array, required: true },
});

const emit = defineEmits(['select', 'create']);

const creating = ref(false);
const newName = ref('');
const newDescription = ref('');

function submitCreate() {
  if (!newName.value.trim()) return;
  emit('create', { name: newName.value.trim(), description: newDescription.value });
  newName.value = '';
  newDescription.value = '';
  creating.value = false;
}

const isButtonDisabled = computed(() => {

  const isEmpty = newName.value.trim() === ''
  const isTooShort = newName.value.length < 3

  return isEmpty || isTooShort
}) 
</script>

