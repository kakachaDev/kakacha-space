<script setup lang="ts">
import StatBar from '../components/StatBar.vue'

interface FactStat {
  value: string
  label: string
  explain: string
}

interface Perk {
  title: string
  proof: string
}

interface TimelineEntry {
  period: string
  text: string
}

const stats: FactStat[] = [
  {
    value: '7+',
    label: 'лет в коммерческой разработке',
    explain: 'с 2019: геймдев на Unity → фронтенд',
  },
  {
    value: '~1000',
    label: 'коммитов в текущий продукт',
    explain: 'единственный фронтендер real-time PWA, 22 месяца',
  },
  {
    value: '100+',
    label: 'компонентов из Figma',
    explain: 'в паре с дизайнером, единая дизайн-система',
  },
  {
    value: '3',
    label: 'учебных года преподавания',
    explain: 'колледж МВЕК: от геймдева до связки фронт+бэк',
  },
]

const perks: Perk[] = [
  {
    title: 'Одиночный рейд',
    proof:
      'Два года веду фронтенд высоконагруженного real-time PWA в одиночку: архитектура, релизы, поддержка.',
  },
  {
    title: 'Кузнец инструментов',
    proof:
      'Написал движок частиц на Canvas 2D, заменивший тяжёлую vendor-библиотеку: меньше бандл, быстрее на слабых устройствах.',
  },
  {
    title: 'Строгая типизация',
    proof:
      'Внутренний SDK продукта на strict TypeScript с тестами на Vitest — бизнес-логика изолирована от UI.',
  },
  {
    title: 'Реалтайм',
    proof: 'Синхронизация состояния между клиентами через WebSocket (SignalR) в продакшене.',
  },
  {
    title: 'Переводчик с дизайнерского',
    proof: 'Макеты Figma превращаются в код без потерь — включая анимации: Lottie, твины, частицы.',
  },
  {
    title: 'Наставник',
    proof:
      'Три года вёл курсы у студентов колледжа, включая практический курс о том, как подружить фронтенд с бэкендом.',
  },
]

const timeline: TimelineEntry[] = [
  { period: '2019', text: 'Вход в геймдев: junior Unity-разработчик, 10+ hyper-casual игр.' },
  {
    period: '2021',
    text: 'Ведущий Unity-разработчик: ядро low-code фреймворка AppCore, собственная ECS.',
  },
  {
    period: '2022–2023',
    text: 'Java-плагины для Minecraft и сайт проекта (по совместительству); начал преподавать.',
  },
  {
    period: '2024',
    text: 'Переход во фронтенд: единственный разработчик клиентской части real-time PWA-продукта.',
  },
  { period: '2026', text: 'Продукт выходит на релиз — открыт к новым квестам.' },
]
</script>

<template>
  <section>
    <h2 class="display">Character <span class="sub">— обо мне</span></h2>
    <p>
      Егор Тимофеев, фронтенд-разработчик с геймдев-прошлым. Семь лет назад начинал с мобильных
      игр на Unity, дорос до ядра собственного фреймворка — а потом перенёс всё это архитектурное
      мышление в веб. Последние два года в одиночку строю клиентскую часть высоконагруженного
      real-time PWA-продукта: от первого коммита до релиза.
    </p>
    <p>
      Побочные квесты: плагины для Minecraft (Paper), игры на Godot и LittleJS, аудиоплагин на
      JUCE, Telegram-боты — полный список в Quest Log, разборы — в Chronicle.
    </p>

    <h3 class="block-title">Player stats</h3>
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card" data-testid="fact-stat">
        <span class="stat-card__value">{{ stat.value }}</span>
        <span class="stat-card__label">{{ stat.label }}</span>
        <span class="stat-card__explain">{{ stat.explain }}</span>
      </div>
    </div>
    <div class="joke-bar">
      <StatBar label="Кофе" :value="100" />
    </div>

    <h3 class="block-title">Перки</h3>
    <ul class="perks">
      <li v-for="perk in perks" :key="perk.title" data-testid="perk">
        <span class="perks__title">{{ perk.title }}</span>
        <span class="perks__proof">{{ perk.proof }}</span>
      </li>
    </ul>

    <h3 class="block-title">Пройденный путь</h3>
    <ol class="timeline">
      <li v-for="entry in timeline" :key="entry.period">
        <span class="timeline__period">{{ entry.period }}</span>
        <span class="timeline__text">{{ entry.text }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.sub {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dim);
  letter-spacing: 0;
}

.block-title {
  margin-top: 2rem;
  color: var(--accent-gold);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 0.3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-card__value {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  color: var(--accent-gold);
  line-height: 1;
}

.stat-card__label {
  font-size: 0.85rem;
}

.stat-card__explain {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.joke-bar {
  margin-top: 0.9rem;
  max-width: 260px;
}

.perks {
  list-style: none;
  padding: 0;
  margin: 0;
}

.perks li {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--panel-border);
}

.perks__title {
  display: block;
  color: var(--accent-gold);
  font-weight: 600;
}

.perks__proof {
  display: block;
  color: var(--text-dim);
  font-size: 0.9rem;
  margin-top: 0.15rem;
}

.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline li {
  display: flex;
  gap: 1rem;
  padding: 0.45rem 0;
}

.timeline__period {
  flex: 0 0 5.5rem;
  color: var(--accent-gold);
  font-family: 'Cinzel', serif;
}

.timeline__text {
  color: var(--text-dim);
}
</style>
