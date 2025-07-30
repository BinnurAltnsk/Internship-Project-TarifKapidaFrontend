import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeReviewForm from "./RecipeReviewForm";
import { reviewService } from "../../services/reviewService";
import PaginatedRecipeReviewList from "../Review/PaginatedRecipeReviewList";


export default function RecipeDetailModal({ recipe, user, onClose }) {
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        setLoading(true);
        setError("");
        const API_BASE_URL = localStorage.getItem('API_BASE_URL');
        const response = await axios.get(`${API_BASE_URL}/api/Review/GetAverageRating/${recipe.recipeId}`);
        setAverageRating(response.data.averageRating?.toFixed(1) || null);
        setReviewCount(response.data.reviewCount || 0);
      } catch (err) {
        console.error("Ortalama değerlendirme yüklenemedi:", err);
        setError("Ortalama değerlendirme yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    if (recipe.recipeId) {
      fetchAverageRating();
    }
  }, [recipe.recipeId]);
  
  return (
    <div
      className="modal"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#333",
          borderRadius: 16,
          padding: 32,
          maxWidth: 600,
          width: "100%",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#FF6B6B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Kapat
        </button>

        {/* Görsel */}
        {recipe.recipeImageUrl && (
          <img
            src={recipe.recipeImageUrl}
            alt={recipe.recipeName}
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: 20,
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x300/FF6B6B/FFFFFF?text=Tarif+Resmi";
            }}
          />
        )}

        {/* Başlık */}
        <h2>{recipe.recipeName}</h2>

        {/* Malzemeler */}
        <div style={{ marginBottom: 16 }}>
          <h4>Malzemeler:</h4>
          <p>{recipe.recipeIngredients}</p>
        </div>

        {/* Hazırlanış */}
        <div style={{ marginBottom: 16 }}>
          <h4>Hazırlanışı:</h4>
          <p>{recipe.recipeInstructions}</p>
        </div>

        {/* Ortalama Puan */}
        <div style={{ marginBottom: 24 }}>
          <h4>Değerlendirmeler:</h4>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : averageRating ? (
            <p>
              ⭐ {averageRating} / 5
              <span style={{ marginLeft: 8, color: "#777" }}>({reviewCount} değerlendirme)</span>
            </p>
          ) : (
            <p>Henüz değerlendirme yok.</p>
          )}
        </div>

        {/* Yorum Listesi */}
        <PaginatedRecipeReviewList recipeId={recipe.recipeId} />

        {/* Yorum Formu */}
        {user && (
          <RecipeReviewForm
            recipeId={recipe.recipeId}
            user={user}
            onReviewSubmit={() => {
              // Değerlendirme yapıldığında ortalama tekrar yüklensin
              axios
                .get(`http://localhost:7175/api/Review/GetAverageRating/${recipe.recipeId}`)
                .then((res) => {
                  setAverageRating(res.data.averageRating?.toFixed(1));
                  setReviewCount(res.data.reviewCount);
                });
            }}
          />
        )}
      </div>
    </div>
  );
}
