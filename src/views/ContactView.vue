<script setup lang="ts">
import { ref } from 'vue'

type SendState = 'idle' | 'sending' | 'ok' | 'error'

const name = ref('')
const reply = ref('')
const message = ref('')
const botField = ref('')
const state = ref<SendState>('idle')

async function submit(): Promise<void> {
  if (state.value === 'sending') return
  state.value = 'sending'
  try {
    const body = new URLSearchParams({
      'form-name': 'contact',
      name: name.value,
      reply: reply.value,
      message: message.value,
      'bot-field': botField.value,
    })
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    state.value = res.ok ? 'ok' : 'error'
  } catch {
    state.value = 'error'
  }
}
</script>

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

    <h3 class="form-title">Оставить сообщение</h3>
    <p v-if="state === 'ok'" class="form-status form-status--ok" data-testid="form-ok">
      Сообщение отправлено — отвечу на указанный контакт.
    </p>
    <form v-else class="contact-form" data-testid="contact-form" @submit.prevent="submit">
      <label>
        Как вас зовут
        <input v-model="name" type="text" name="name" required maxlength="120" />
      </label>
      <label>
        Куда ответить (почта или телеграм)
        <input v-model="reply" type="text" name="reply" required maxlength="200" />
      </label>
      <label>
        Сообщение
        <textarea v-model="message" name="message" required rows="5" maxlength="4000" />
      </label>
      <label class="hp" aria-hidden="true">
        Не заполняйте это поле
        <input v-model="botField" type="text" name="bot-field" tabindex="-1" autocomplete="off" />
      </label>
      <button type="submit" :disabled="state === 'sending'">
        {{ state === 'sending' ? 'Отправляю…' : 'Отправить' }}
      </button>
      <p v-if="state === 'error'" class="form-status form-status--error" data-testid="form-error">
        Не отправилось. Попробуйте ещё раз или напишите на почту выше.
      </p>
    </form>
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

.form-title {
  margin-top: 2rem;
  color: var(--accent-gold);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 0.3rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  max-width: 480px;
}

.contact-form label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.88rem;
  color: var(--text-dim);
}

.contact-form input,
.contact-form textarea {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  color: var(--text);
  font: inherit;
  padding: 0.5rem 0.65rem;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
}

.contact-form button {
  align-self: flex-start;
  background: transparent;
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  border-radius: 4px;
  padding: 0.5rem 1.4rem;
  font: inherit;
  cursor: pointer;
}

.contact-form button:hover:not(:disabled) {
  background: rgba(201, 161, 90, 0.12);
}

.contact-form button:disabled {
  opacity: 0.6;
  cursor: default;
}

.hp {
  position: absolute;
  left: -9999px;
}

.form-status--ok {
  color: var(--accent-gold);
}

.form-status--error {
  color: #c96a5a;
  font-size: 0.88rem;
}
</style>
