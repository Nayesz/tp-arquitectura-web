<script setup>
import { ref, onMounted } from 'vue';
import { api } from './api';
import ListColumn from './components/ListColumn.vue';
import CardFormModal from './components/CardFormModal.vue';
import ReportView from './components/ReportView.vue';

const activeTab = ref('board'); // 'board' | 'report'
const loading = ref(true);
const errorMsg = ref('');

const board = ref(null);
const lists = ref([]);
const cardsByList = ref({}); // { [listId]: Card[] }
const report = ref(null);

const modalOpen = ref(false);
const editingCard = ref(null); // null = creando
const activeListForModal = ref(null);

async function loadBoard() {
  loading.value = true;
  errorMsg.value = '';
  try {
    const boards = await api.getBoards();
    if (!boards.length) {
      errorMsg.value = 'No hay tableros disponibles.';
      return;
    }
    board.value = boards[0];
    lists.value = await api.getLists(board.value.id);

    const entries = await Promise.all(
      lists.value.map(async (list) => [list.id, await api.getCards(list.id)])
    );
    cardsByList.value = Object.fromEntries(entries);
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function loadReport() {
  if (!board.value) return;
  errorMsg.value = '';
  try {
    report.value = await api.getReport(board.value.id);
  } catch (err) {
    errorMsg.value = err.message;
  }
}

function switchTab(tab) {
  activeTab.value = tab;
  if (tab === 'report') loadReport();
}

function openCreateModal(list) {
  editingCard.value = null;
  activeListForModal.value = list;
  modalOpen.value = true;
}

function openEditModal(card) {
  editingCard.value = card;
  activeListForModal.value = lists.value.find((l) => l.id === card.listId) || null;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingCard.value = null;
  activeListForModal.value = null;
}

async function saveCard(payload) {
  errorMsg.value = '';
  try {
    if (editingCard.value) {
      const updated = await api.updateCard(editingCard.value.id, payload);
      const list = cardsByList.value[updated.listId];
      const idx = list.findIndex((c) => c.id === updated.id);
      if (idx !== -1) list[idx] = updated;
    } else {
      const created = await api.createCard(activeListForModal.value.id, payload);
      cardsByList.value[activeListForModal.value.id].push(created);
    }
    closeModal();
  } catch (err) {
    errorMsg.value = err.message;
  }
}

async function deleteCard(card) {
  if (!confirm(`¿Eliminar la tarjeta "${card.title}"?`)) return;
  errorMsg.value = '';
  try {
    await api.deleteCard(card.id);
    cardsByList.value[card.listId] = cardsByList.value[card.listId].filter((c) => c.id !== card.id);
  } catch (err) {
    errorMsg.value = err.message;
  }
}

async function moveCard(card, targetListId) {
  errorMsg.value = '';
  try {
    const targetCards = cardsByList.value[targetListId] || [];
    const updated = await api.moveCard(card.id, {
      targetListId,
      position: targetCards.length + 1,
    });

    cardsByList.value[card.listId] = cardsByList.value[card.listId].filter((c) => c.id !== card.id);
    cardsByList.value[targetListId].push(updated);
  } catch (err) {
    errorMsg.value = err.message;
  }
}

onMounted(loadBoard);
</script>

<template>
  <header class="app-header">
    <h1>{{ board ? board.name : 'Tablero Kanban' }}</h1>
    <div class="tabs">
      <button :class="{ active: activeTab === 'board' }" @click="switchTab('board')">Tablero</button>
      <button :class="{ active: activeTab === 'report' }" @click="switchTab('report')">Reporte</button>
    </div>
  </header>

  <main class="app-body">
    <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>

    <div v-if="loading" class="loading">Cargando tablero…</div>

    <template v-else>
      <section v-if="activeTab === 'board'" class="board">
        <ListColumn
          v-for="list in lists"
          :key="list.id"
          :list="list"
          :cards="cardsByList[list.id] || []"
          :all-lists="lists"
          @add-card="openCreateModal"
          @edit-card="openEditModal"
          @delete-card="deleteCard"
          @move-card="moveCard"
        />
      </section>

      <section v-else-if="activeTab === 'report'">
        <div v-if="!report" class="loading">Cargando reporte…</div>
        <ReportView v-else :report="report" />
      </section>
    </template>
  </main>

  <CardFormModal
    v-if="modalOpen"
    :card="editingCard"
    :list-name="activeListForModal?.name || ''"
    @save="saveCard"
    @close="closeModal"
  />
</template>
