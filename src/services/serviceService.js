import api from "../lib/api";

class ServiceService {
  async getAllServices() {
    try {
      const response = await api.get("/metiers/services");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des services"
      );
    }
  }
}

export default new ServiceService();
