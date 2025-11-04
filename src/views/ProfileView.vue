<template>
  <div>
    <h2>Профиль пользователя</h2>
    <div v-if="user">
      <p><strong>Имя:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div v-else>
      <p>Необходимо войти в систему.</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
export default {
  setup() {
    const authStore = useAuthStore();
    return { user: authStore.user };
  },
};
</script>
