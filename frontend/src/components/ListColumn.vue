<script setup>
import CardItem from './CardItem.vue';

defineProps({
  list: { type: Object, required: true },
  cards: { type: Array, required: true },
  allLists: { type: Array, required: true },
});

const emit = defineEmits(['add-card', 'edit-card', 'delete-card', 'move-card']);
</script>

<template>
  <div class="list-column">
    <div class="list-column__header">
      <h2>{{ list.name }}</h2>
      <span class="list-column__count">{{ cards.length }}</span>
    </div>

    <div class="card-list">
      <CardItem
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :lists="allLists"
        @edit="(c) => emit('edit-card', c)"
        @delete="(c) => emit('delete-card', c)"
        @move="(c, targetListId) => emit('move-card', c, targetListId)"
      />
    </div>

    <button class="add-card-btn" @click="emit('add-card', list)">+ Agregar tarjeta</button>
  </div>
</template>
