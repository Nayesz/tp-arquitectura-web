<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  card: { type: Object, default: null }, // null = modo creación
  listName: { type: String, default: '' },
});

const emit = defineEmits(['save', 'close']);

const title = ref('');
const description = ref('');
const dueDate = ref('');
const labelsText = ref('');

watch(
  () => props.card,
  (card) => {
    title.value = card?.title || '';
    description.value = card?.description || '';
    dueDate.value = card?.dueDate || '';
    labelsText.value = card?.labels?.join(', ') || '';
  },
  { immediate: true }
);

function submit() {
  if (!title.value.trim()) return;

  emit('save', {
    title: title.value.trim(),
    description: description.value,
    dueDate: dueDate.value || null,
    labels: labelsText.value
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean),
  });
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h3>{{ card ? 'Editar tarjeta' : `Nueva tarjeta en "${listName}"` }}</h3>

      <div class="field">
        <label for="title">Título *</label>
        <input id="title" v-model="title" type="text" placeholder="Título de la tarjeta" />
      </div>

      <div class="field">
        <label for="description">Descripción</label>
        <textarea id="description" v-model="description" rows="3" placeholder="Descripción (opcional)"></textarea>
      </div>

      <div class="field">
        <label for="dueDate">Fecha de vencimiento</label>
        <input id="dueDate" v-model="dueDate" type="date" />
      </div>

      <div class="field">
        <label for="labels">Etiquetas (separadas por coma)</label>
        <input id="labels" v-model="labelsText" type="text" placeholder="backend, prioridad-alta" />
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="emit('close')">Cancelar</button>
        <button class="btn-primary" @click="submit">Guardar</button>
      </div>
    </div>
  </div>
</template>
