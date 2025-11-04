<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <div class="nav-left">
          <router-link class="brand" to="/">🏦 Мой Банк</router-link>
          <router-link to="/">Главная</router-link>
          <router-link to="/accounts">Счета</router-link>
          <router-link to="/profile">Профиль</router-link>
        </div>

        <div class="nav-right">
          <div v-if="isAuthenticated && user" class="user-info">
            <span>Добро пожаловать, <strong>{{ user.name }}</strong>!</span>
            <button class="btn btn-logout" @click="logout">Выйти</button>
          </div>

          <form v-else class="login-form" @submit.prevent="login">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              required
              class="form-input"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Пароль"
              required
              class="form-input"
            />
            <button type="submit" class="btn btn-login">Войти</button>
            <p v-if="authError" class="error">{{ authError }}</p>
          </form>
        </div>
      </nav>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      authStore: useAuthStore(),
    };
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    user() {
      return this.authStore.user;
    },
    authError() {
      return this.authStore.errorMessage;
    },
  },
  methods: {
    logout() {
      this.authStore.logout();
    },
    login() {
      this.authStore.login({
        email: this.email,
        password: this.password,
      });
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      this.authStore.isAuthenticated = true;
      this.authStore.getUser();
    }
  },
};
</script>

<style scoped>
/* === Основное оформление === */
body {
  font-family: "Segoe UI", Roboto, sans-serif;
  background-color: #f6f8fa;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* === Навигация === */
.navbar {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #212529;
  padding: 12px 20px;
  flex-wrap: wrap;
  border-radius: 8px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand {
  font-weight: bold;
  color: #ffc107;
  text-decoration: none;
}

.nav-left a {
  text-decoration: none;
  transition: color 0.2s;
}

.nav-left a:hover {
  color: #fff;
}

/* === Форма входа === */
.login-form {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-input {
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.error {
  color: #ff4444;
  margin-left: 10px;
  font-size: 13px;
}

/* === Кнопки === */
.btn {
  cursor: pointer;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: 0.2s;
  font-size: 14px;
}

.btn-login {
  background-color: #28a745;
  color: white;
}

.btn-login:hover {
  background-color: #218838;
}

.btn-logout {
  background-color: #dc3545;
  color: white;
  margin-left: 10px;
}

.btn-logout:hover {
  background-color: #c82333;
}

/* === Контент === */
.content {
  flex-grow: 1;
  padding: 30px;
  background-color: #212529;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1400px;
}

/* === Пользователь === */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ddd;
}
</style>
