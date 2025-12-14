import { defineStore } from "pinia";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [],
    transactions: [],
    transactions_total: 0,
    errorMessage: "",
    loading: false,
  }),

  actions: {
    clear() {
      this.accounts = [];
      this.transactions = [];
      this.transactions_total = 0;
      this.errorMessage = "";
      this.loading = false;
    },

    async getAccounts() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await axios.get(`${backendUrl}/accounts`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        this.accounts = response.data;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },

    async getTransactions(account_id, page = 0, perpage = 5) {
      this.loading = true;
      try {
        const response = await axios.get(
          `${backendUrl}/accounts/${account_id}/transactions`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params: { page, perpage },
          }
        );
        this.transactions = response.data;
        console.log(response.data);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },

    async getTransactionsTotal(account_id) {
      try {
        const response = await axios.get(
          `${backendUrl}/accounts/${account_id}/transactions_total`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        this.transactions_total = response.data;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
});
