<template>
  <section>
    <h2 class="display">Notice Board <span class="sub">— контакты</span></h2>
    <p class="lead">Ищете фронтендера с геймдев-бэкграундом? Напишите — отвечаю быстро.</p>
    <ul class="notice-list">
      <li>
        <span class="notice-list__label">Почта</span>
        <a href="mailto:krougzee@yandex.ru">krougzee@yandex.ru</a>
      </li>
      <li>
        <span class="notice-list__label">GitHub</span>
        <a href="https://github.com/kakachaDev" target="_blank" rel="noopener">github.com/kakachaDev</a>
      </li>
      <li>
        <span class="notice-list__label">Сайт</span>
        <a href="https://kakacha.space">kakacha.space</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sub {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dim);
  letter-spacing: 0;
}

.lead {
  color: var(--text-dim);
  font-size: 0.92rem;
}

.notice-list {
  list-style: none;
  padding: 0;
}

.notice-list li {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--panel-border);
  display: flex;
  gap: 1rem;
}

.notice-list__label {
  flex: 0 0 5rem;
  color: var(--text-dim);
  font-size: 0.9rem;
}
</style>
