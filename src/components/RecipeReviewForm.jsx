import React, { useState } from "react";
import StarRating from "./StarRating";
import { reviewService } from "../services/reviewService";

export default function RecipeReviewForm({
  recipeId,
  user,
  onReviewSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!rating || !reviewText.trim()) {
      setError("Lütfen puan ve yorum girin.");
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        RecipeId: recipeId,
        UserId: user.userId,
        ReviewText: reviewText,
        Rating: rating
      };

      console.log("Yorum gönderiliyor:", reviewData);
      console.log("User bilgileri:", user);
      
      const response = await reviewService.createReview(reviewData);
      console.log("Yorum response:", response);
      
      setSuccess(true);
      setRating(0);
      setReviewText("");
      
      if (onReviewSubmit) onReviewSubmit();
    } catch (err) {
      console.error("Yorum hatası detayı:", err.response?.data);
      console.error("Yorum hatası status:", err.response?.status);
      setError(err?.response?.data?.message || "Yorum kaydedilemedi. Lütfen tekrar deneyin.");
      console.error("Yorum gönderme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <StarRating value={rating} onChange={setRating} />
        <span style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          {rating > 0 ? `${rating} / 5` : "Puan ver"}
        </span>
      </div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        rows={3}
        style={{
          width: "100%",
          borderRadius: 8,
          border: "1px solid var(--border-color)",
          padding: 8,
          fontSize: 15,
          background: "var(--input-bg)",
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      />
      {error && <div style={{ color: "var(--error-color)", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "var(--success-color)", marginBottom: 8 }}>Yorumunuz kaydedildi!</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          background: "var(--accent-color)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 20px",
          fontWeight: 500,
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
