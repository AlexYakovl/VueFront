<template>
  <div class="p-4">

    <!-- Список счетов -->
    <div v-if="user">
      <h2 class="text-xl font-bold mb-4">Ваши счета</h2>
    </div>
    <div v-else>
      <h2 class="text-xl font-bold mb-4" >Необходимо войти в систему.</h2>
    </div>
    <div class="flex gap-3 flex-wrap mb-6">
      <Button
        v-for="acc in accounts"
        :key="acc.id"
        @click="selectAccount(acc)"
        severity="secondary"
        :outlined="selectedAccount?.id !== acc.id"
      >
        {{ acc.number}} ({{ acc.currency }} ₽)
      </Button>
    </div>

    <!-- Таблица транзакций -->
    <div v-if="selectedAccount">

      <h3 class="text-lg font-semibold mb-2">
        Операции по счёту: {{ selectedAccount.name }}
      </h3>

      <DataTable
        :value="transactions"
        :lazy="true"
        :loading="accountsStore.loading"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[5, 10, 20]"
        :totalRecords="transactions_total"
        @page="onPageChange"
        :first="offset"
        responsive-layout="scroll"
      >
        <Column field="id" header="ID"/>
        <Column field="type" header="Тип"/>
        <Column field="amount" header="Сумма"/>
        <Column field="created_at" header="Дата"/>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { useAccountsStore } from "@/stores/accountStore";
import { useAuthStore } from "@/stores/authStore.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

export default {
  name: "AccountView",
  components: { DataTable, Column, Button },
  setup() {
    const authStore = useAuthStore();
    return { user: authStore.user };
  },

  data() {
    return {
      accountsStore: useAccountsStore(),
      selectedAccount: null,

      offset: 0,
      perpage: 5,
    };
  },

  computed: {
    accounts() {
      return this.accountsStore.accounts;
    },
    transactions() {
      return this.accountsStore.transactions;
    },
    transactions_total() {
      return this.accountsStore.transactions_total;
    },
  },

  mounted() {
    this.accountsStore.getAccounts();
  },

  methods: {
    async selectAccount(account) {
      this.selectedAccount = account;

      this.offset = 0;
      await this.accountsStore.getTransactions(account.id, 0, this.perpage);
      await this.accountsStore.getTransactionsTotal(account.id);
    },

    async onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;

      await this.accountsStore.getTransactions(
        this.selectedAccount.id,
        this.offset / this.perpage,
        this.perpage
      );
    },
  },
};
</script>

<style scoped>
</style>
