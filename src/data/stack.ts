import type { StackCategory, StackItem } from '../types'

export const skillCategories: StackCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      {
        name: 'Vue 3 + Composition API',
        note: '2 года единственным фронтендером высоконагруженного real-time PWA: 100+ компонентов, вся архитектура клиента.',
      },
      {
        name: 'TypeScript',
        note: 'Внутренний SDK продукта целиком на strict TS: адаптеры REST/WebSocket, менеджер переподключений, тесты на Vitest.',
      },
      {
        name: 'Pinia + RxJS',
        note: 'Реактивное состояние в реальном времени: балансы и транзакционные потоки пользователя.',
      },
      {
        name: 'WebSocket (SignalR)',
        note: 'Real-time синхронизация состояния между клиентами в продакшене.',
      },
      {
        name: 'Canvas 2D',
        note: 'Собственный движок частиц, заменивший тяжёлую vendor-библиотеку, — меньше бандл, быстрее на слабых устройствах.',
      },
      {
        name: 'Lottie',
        note: 'Оптимизация рендеринга: canvas или SVG в зависимости от сложности анимации.',
      },
      {
        name: 'PWA / Workbox',
        note: 'Офлайн-кеширование, service worker и стратегии обновления в боевом продукте (и на этом сайте).',
      },
      {
        name: 'Vite + Tailwind CSS',
        note: 'Ежедневный инструментарий: сборка, code-splitting, оптимизация ассетов.',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend и интеграции',
    items: [
      {
        name: 'Node.js / Express',
        note: 'Внутренние инструменты и клиент-серверные приложения в геймдев-командах.',
      },
      {
        name: 'Python / FastAPI',
        note: 'Сервисы аналитики и визуализации для внутренних пайплайнов.',
      },
      {
        name: 'PHP (Laravel + свой MVC)',
        note: 'Коммерческий опыт: сайты и серверная логика; собственный MVC-фреймворк как упражнение в архитектуре.',
      },
      {
        name: 'REST / gRPC',
        note: 'Проектирование и потребление API с обеих сторон.',
      },
    ],
  },
  {
    id: 'gamedev',
    title: 'Gamedev',
    items: [
      {
        name: 'Unity / C#',
        note: '5+ лет: ядро low-code фреймворка AppCore, собственная ECS, участие в MMORPG, 10+ hyper-casual игр.',
      },
      {
        name: 'Godot 4',
        note: 'Пет-проекты и геймджемы — см. Quest Log.',
      },
      {
        name: 'Java / Paper API',
        note: 'Плагины для Minecraft-серверов: от лут-систем до переработки поведения мобов.',
      },
      {
        name: 'LittleJS',
        note: 'Мини-игры для веб-площадок; выбор движка обоснован в блоге.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Инструменты',
    items: [
      {
        name: 'Figma → код',
        note: 'Весь UI текущего продукта перенесён из макетов в код в паре с дизайнером, с единой дизайн-системой.',
      },
      {
        name: 'Vitest + @vue/test-utils',
        note: 'Тесты SDK и компонентов; этот сайт тоже покрыт.',
      },
      {
        name: 'Git, Linux',
        note: 'Повседневная среда работы.',
      },
      {
        name: 'JUCE / C++',
        note: 'Аудиоплагин ErosionFx — DSP и нативный UI.',
      },
    ],
  },
]

export const siteStack: StackItem[] = [
  { name: 'Vue 3 + Vite + TypeScript', note: 'Composition API, строгий TS, мгновенный HMR.' },
  { name: 'vue-router', note: 'Настоящие URL у каждого раздела меню.' },
  { name: 'Web Worker', note: 'Физика фоновых частиц считается вне основного потока.' },
  { name: 'vite-plugin-pwa', note: 'Офлайн-кеш app shell, сайт устанавливается как приложение.' },
  { name: 'markdown-it', note: 'Блог собирается из Markdown-файлов на этапе сборки — без бэкенда.' },
  { name: 'Vitest + @vue/test-utils', note: 'Юнит- и компонентные тесты в том же тулчейне.' },
  { name: '@fontsource/inter + @fontsource/cinzel', note: 'Шрифты self-hosted, без внешних запросов.' },
]
