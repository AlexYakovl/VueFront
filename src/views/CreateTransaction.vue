<template>
  <div class="flex justify-center">
    <form @submit.prevent="createTransaction" class="w-1/2 p-6">
      <h2 class="text-2xl mb-4 text-center" style="color: dimgrey">
        Добавление транзакции
      </h2>

      <!-- ТИП ТРАНЗАКЦИИ -->
      <div class="flex flex-col mb-4">
        <label class="mb-1 text-gray-600">Тип транзакции</label>
        <select v-model="transactionType"
                class="border px-3 py-2 rounded-md">
          <option value="income">Приход</option>
          <option value="expense">Расход</option>
        </select>
      </div>

      <!-- СЧЕТЫ КНОПКАМИ -->
      <div class="flex flex-col mb-4">
        <label class="mb-1 text-gray-600">Выберите счёт</label>

        <div class="flex gap-3 flex-wrap mb-6">
          <Button
            v-for="acc in accounts"
            :key="acc.id"
            @click="selectAccount(acc)"
            severity="secondary"
            :outlined="selectedAccount?.id !== acc.id"
          >
            Счет: {{ acc.number }} ({{ acc.currency }})
          </Button>
        </div>
      </div>

      <!-- СУММА -->
      <div class="flex flex-col mb-4">
        <label class="mb-1 text-gray-600">Сумма</label>
        <InputText type="number"
                   placeholder="Введите сумму"
                   v-model="amount" />
      </div>


      <!-- ИЗОБРАЖЕНИЕ -->
      <div class="mb-4 mt-4">
        <label id="file-label"
               for="file-input"
               class="block text-md font-medium text-gray-500 border border-gray-300 rounded-md p-2 cursor-pointer">
          <span class="pi pi-upload mx-3"></span>Выбрать изображение (чек)
        </label>

        <input
          id="file-input"
          type="file"
          hidden
          @change="changeFile"
          accept="image/*"
        />
      </div>

      <!-- SUBMIT -->
      <div class="flex flex-col mt-6">
        <Button type="submit" label="Создать" />
      </div>
    </form>
  </div>

  <Toast position="bottom-right" />
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useTransactionStore } from "@/stores/transactionStore.js";
import { useAccountsStore } from "../stores/accountStore";

export default {
  name: "CreateTransaction",
  components: { InputText, Button, Toast },

  data() {
    return {
      transactionStore: useTransactionStore(),
      accountsStore: useAccountsStore(),

      accounts: [],
      selectedAccount: null,

      transactionType: "expense",
      amount: "",
      transaction_time: "",
      imageFile: null,
    };
  },

  async mounted() {
    await this.accountsStore.getAccounts();
    this.accounts = this.accountsStore.accounts;
    this.setCurrentTime();
  },

  computed: {
    errorMessage() {
      return this.transactionStore.errorMessage;
    },
    errorCode() {
      return this.transactionStore.errorCode;
    },
  },

  methods: {
    setCurrentTime() {
      const now = new Date();

      // Формат для backend: YYYY-MM-DD HH:MM:SS
      const pad = (n) => n.toString().padStart(2, "0");

      this.transaction_time =
        now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate()) +
        " " +
        pad(now.getHours()) +
        ":" +
        pad(now.getMinutes()) +
        ":" +
        pad(now.getSeconds());
    },

      selectAccount(acc) {
      this.selectedAccount = acc;
    },

    changeFile(event) {
      const file = event.target.files[0];
      if (file) {
        document.getElementById("file-label").innerHTML =
          `<span class='pi pi-file mx-3'></span>${file.name}`;
        this.imageFile = file;
      } else {
        document.getElementById("file-label").innerHTML =
          `<span class='pi pi-upload mx-3'></span>Выбрать изображение`;
        this.imageFile = null;
      }
    },

    async createTransaction() {
      if (!this.selectedAccount) {
        this.$toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: "Выберите счёт!",
          life: 4000,
        });
        return;
      }

      const formData = new FormData();

      formData.append("account_id", this.selectedAccount.id);
      formData.append("amount", this.amount);
      formData.append("transaction_time", this.transaction_time);
      formData.append("receipt", this.imageFile);

      if (this.transactionType === "expense") {
        await this.transactionStore.createExpense(formData);
      } else {
        await this.transactionStore.createIncome(formData);
      }

      if (this.errorCode > 0) {
        this.$toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: this.errorMessage,
          life: 4000,
        });
      } else {
        this.$toast.add({
          severity: "success",
          summary: "Транзакция добавлена",
          detail: this.errorMessage,
          life: 4000,
        });
      }
    },
  },
};
</script>

<style scoped></style>
