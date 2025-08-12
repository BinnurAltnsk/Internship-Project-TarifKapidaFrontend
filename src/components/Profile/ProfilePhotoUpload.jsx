import React, { useState } from "react";
import axios from "axios";
import "./ProfilePhotoUpload.css";

const ProfilePhotoUpload = ({ user, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !user?.userId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.userId);

    setUploading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/api/User/UploadProfilePhoto`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onUploadSuccess(); // Profil fotoğrafı yüklendikten sonra parent’a bildir
    } catch (err) {
      console.error("Profil fotoğrafı yüklenemedi:", err);
      setError("Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Yükleniyor..." : "Fotoğrafı Yükle"}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ProfilePhotoUpload;
