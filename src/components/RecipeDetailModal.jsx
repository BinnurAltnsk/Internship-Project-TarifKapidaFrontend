import React, { useEffect, useState } from "react";
import RecipeReviewForm from "./RecipeReviewForm";
import StarRating from "./StarRating";
import { reviewService } from "../services/reviewService";

export default function RecipeDetailModal({ recipe, user, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Yorumları API'den çek
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await reviewService.getReviews();
      // Tarif ID'sine göre filtrele
      const recipeReviews = response.data.filter(review => review.recipeId === recipe.recipeId);
      setReviews(recipeReviews);
    } catch (err) {
      console.error("Yorumlar yüklenemedi:", err);
      setError("Yorumlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [recipe.recipeId]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => {
            const rating = r?.rating;
            return sum + (typeof rating === "number" ? rating : 0);
          }, 0) / reviews.length
        ).toFixed(1)
      : null;

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
          background: "var(--modal-bg)",
          color: "var(--text-primary)",
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
            background: "var(--accent-color)",
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

        {recipe.recipeImageUrl && (
          <img
            src={recipe.recipeImageUrl}
            alt={recipe.recipeName}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: 16,
            }}
          />
        )}

        <h2 style={{ marginBottom: 16, color: "var(--text-primary)" }}>
          {recipe.recipeName}
        </h2>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8, color: "var(--text-primary)" }}>
            Malzemeler:
          </h3>
          <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {recipe.recipeIngredients}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8, color: "var(--text-primary)" }}>
            Hazırlanışı:
          </h3>
          <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {recipe.recipeInstructions}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8, color: "var(--text-primary)" }}>
            Değerlendirmeler:
          </h3>
          {avgRating && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: "bold" }}>
                ⭐ {avgRating} / 5
              </span>
              <span style={{ color: "var(--text-secondary)", marginLeft: 8 }}>
                ({reviews.length} değerlendirme)
              </span>
            </div>
          )}

          {loading ? (
            <p>Yorumlar yükleniyor...</p>
          ) : error ? (
            <p style={{ color: "var(--error-color)" }}>{error}</p>
          ) : reviews.length === 0 ? (
            <p>Henüz yorum yapılmamış.</p>
          ) : (
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: 12,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: "bold", marginRight: 8 }}>
                      {review.user?.username || "Anonim"}
                    </span>
                    <StarRating rating={review.rating} readonly />
                  </div>
                  <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                    {review.reviewText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && (
          <RecipeReviewForm
            recipeId={recipe.recipeId}
            onReviewSubmit={fetchReviews}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
