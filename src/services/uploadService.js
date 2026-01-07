import api from "@/lib/api";

class UploadService {
  static async uploadFile(file, type) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `/entrepreneuriat/admin/upload/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur upload:", error);
      throw error;
    }
  }

  static async uploadInterviewImage(file) {
    return this.uploadFile(file, "interview-image");
  }

  static async uploadResourceFile(file) {
    return this.uploadFile(file, "resource-file");
  }

  static async uploadEventImage(file) {
    return this.uploadFile(file, "event-image");
  }
}

export default UploadService;
