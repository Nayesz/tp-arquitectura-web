<script setup>
defineProps({
  report: { type: Object, required: true },
});

function pct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}
</script>

<template>
  <div class="report">
    <h2>Reporte: {{ report.boardName }}</h2>

    <div class="report-summary">
      <div class="report-stat">
        <div class="report-stat__value">{{ report.totalCards }}</div>
        <div class="report-stat__label">Tarjetas totales</div>
      </div>
      <div class="report-stat">
        <div class="report-stat__value" :class="{ danger: report.overdueCards > 0 }">
          {{ report.overdueCards }}
        </div>
        <div class="report-stat__label">Tarjetas vencidas</div>
      </div>
      <div class="report-stat">
        <div class="report-stat__value">{{ report.cardsPerList.length }}</div>
        <div class="report-stat__label">Listas</div>
      </div>
    </div>

    <h3>Tarjetas por lista</h3>
    <div v-for="item in report.cardsPerList" :key="item.listId" class="bar-row">
      <span>{{ item.listName }}</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: pct(item.count, report.totalCards) + '%' }"></div>
      </div>
      <span>{{ item.count }}</span>
    </div>
  </div>
</template>
