import { defineStore } from "pinia";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    errorMessage: "",
    errorCode: 0,
    loading: false,
  }),

  actions: {

    async createExpense(formData) {
      this.errorMessage = "";
      this.errorCode = 0;
      this.loading = true;

      try {
        const response = await axios.post(
          `${backendUrl}/expense`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        this.errorCode = 0;
        this.errorMessage = "Расход успешно добавлен";
        return response.data;

      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },


    async createIncome(formData) {
      this.errorMessage = "";
      this.errorCode = 0;
      this.loading = true;

      try {
        const response = await axios.post(
          `${backendUrl}/income`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        this.errorCode = 0;
        this.errorMessage = "Доход успешно добавлен";
        return response.data;

      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },


    handleError(error) {
      if (error.response) {
        this.errorCode = 11;
        this.errorMessage = error.response.data.message || "Ошибка сервера";
        console.log(error);
      } else if (error.request) {
        this.errorCode = 12;
        this.errorMessage = error.message;
        console.log(error);
      } else {
        this.errorCode = 13;
        this.errorMessage = "Неизвестная ошибка";
        console.log(error);
      }
    },
  },
});
