<script setup>
const props = defineProps({
  card: { type: Object, required: true },
  lists: { type: Array, required: true },
});

const emit = defineEmits(['edit', 'delete', 'move']);

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today;
}

function onMove(event) {
  const targetListId = event.target.value;
  if (targetListId && targetListId !== props.card.listId) {
    emit('move', props.card, targetListId);
  }
}
</script>

<template>
  <div class="card-item">
    <div class="card-item__title">{{ card.title }}</div>
    <div v-if="card.description" class="card-item__desc">{{ card.description }}</div>

    <div v-if="card.labels?.length" class="labels">
      <span v-for="label in card.labels" :key="label" class="label-chip">{{ label }}</span>
    </div>

    <span v-if="card.dueDate" class="due-date" :class="{ overdue: isOverdue(card.dueDate) }">
      {{ isOverdue(card.dueDate) ? 'Vencida: ' : 'Vence: ' }}{{ card.dueDate }}
    </span>

    <div class="card-item__actions">
      <select :value="card.listId" @change="onMove" title="Mover a otra lista">
        <option v-for="list in lists" :key="list.id" :value="list.id">{{ list.name }}</option>
      </select>

      <div>
        <button class="icon-btn" @click="emit('edit', card)">Editar</button>
        <button class="icon-btn danger" @click="emit('delete', card)">Eliminar</button>
      </div>
    </div>
  </div>
</template>
