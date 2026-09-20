<template>
  <header class="app-header">
    <div>
          <h1>{{ view === 'workspace' && board ? board.name : 'Tablero' }}</h1>
          <div v-if="showDescription">{{ description }}</div>

    </div>
    <div class="tabs">
      <template v-if="view === 'workspace'">
        <button :class="{ active: activeTab === 'board' }" @click="switchTab('board')">Tablero</button>
        <button :class="{ active: activeTab === 'report' }" @click="switchTab('report')">Reporte</button>
        <button class="header-btn" @click="changeBoard">Cambiar tablero</button>
      </template>
    </div>
  </header>

  <main class="app-body">
    <div v-if="errorMsg" class="error-banner">{{ errorMsg }}</div>
    <div v-if="view === 'loading'" class="loading">Cargando…</div>

    <BoardSelector v-else-if="view === 'selector'" :boards="allBoards" @select="selectBoard" @create="createBoard" />

    <template v-else-if="view === 'workspace'">

      <section v-if="activeTab === 'board'" class="board">
            <ListColumn v-for="list in lists" :key="list.id" :list="list" :cards="cardsByList[list.id] || []"
              :all-lists="lists" @add-card="openCreateModal" @edit-card="openEditModal" @delete-card="deleteCard"
              @move-card="moveCard" />
            <AddListColumn @create="addList" />
      </section>

      <section v-else-if="activeTab === 'report'">
        <div v-if="!report" class="loading">Cargando reporte…</div>
        <ReportView v-else :report="report" />
      </section>
    </template>
  </main>

  <CardFormModal v-if="modalOpen" :card="editingCard" :list-name="activeListForModal?.name || ''" @save="saveCard"
    @close="closeModal" />
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import { api } from './api';
import BoardSelector from './components/BoardSelector.vue';
import ListColumn from './components/ListColumn.vue';
import AddListColumn from './components/AddListColumn.vue';
import CardFormModal from './components/CardFormModal.vue';
import ReportView from './components/ReportView.vue';

const LAST_BOARD_KEY = 'trello-last-board-id';

const view = ref('loading'); // 'loading' | 'selector' | 'workspace'
const activeTab = ref('board'); // 'board' | 'report'
const errorMsg = ref('');

const allBoards = ref([]);
const board = ref(null);
const lists = ref([]);
const cardsByList = ref({}); // { [listId]: Card[] }
const report = ref(null);

const modalOpen = ref(false);
const editingCard = ref(null); // null = creando
const activeListForModal = ref(null);
const description = ref(null);

const showDescription= computed(()=> {
  return view.value != 'selector'
})

async function loadBoardsList() {
  errorMsg.value = '';
  try {
    allBoards.value = await api.getBoards();
  } catch (err) {
    errorMsg.value = err.message;
  }
}

async function loadWorkspace(selectedBoard) {
  errorMsg.value = '';
  try {
    board.value = selectedBoard;
    lists.value = await api.getLists(selectedBoard.id);
    description.value = selectedBoard.description
    const entries = await Promise.all(
      lists.value.map(async (list) => [list.id, await api.getCards(list.id)])
    );
    cardsByList.value = Object.fromEntries(entries);

    localStorage.setItem(LAST_BOARD_KEY, selectedBoard.id);
    activeTab.value = 'board';
    view.value = 'workspace';
  } catch (err) {
    errorMsg.value = err.message;
  }
}

function selectBoard(selectedBoard) {
  loadWorkspace(selectedBoard);
}

async function createBoard(payload) {
  errorMsg.value = '';
  try {
    const created = await api.createBoard(payload);
    allBoards.value.push(created);
    await loadWorkspace(created);
  } catch (err) {
    errorMsg.value = err.message;
  }
}

function changeBoard() {
  view.value = 'selector';
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

async function addList(name) {
  if (!board.value) return;
  errorMsg.value = '';
  try {
    const list = await api.createList(board.value.id, { name });
    lists.value.push(list);
    cardsByList.value[list.id] = [];
  } catch (err) {
    errorMsg.value = err.message;
  }
}

onMounted(async () => {
  await loadBoardsList();

  const lastId = localStorage.getItem(LAST_BOARD_KEY);
  const lastBoard = lastId ? allBoards.value.find((b) => b.id === lastId) : null;

  if (lastBoard) {
    await loadWorkspace(lastBoard);
  } else {
    view.value = 'selector';
  }
});
</script>
