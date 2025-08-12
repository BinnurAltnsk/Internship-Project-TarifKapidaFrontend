import React, { useState } from "react";
import axios from "axios";
import "./RecipeReviewForm.css";

const RecipeReviewForm = ({ user, recipeId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.userId || !recipeId || rating === 0) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/api/Review/CreateReview`, {
        userId: user.userId,
        recipeId,
        rating,
        comment,
      });

      // Üst bileşene bildir
      onReviewSubmit();
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
      setError("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Yorum Bırak</h4>
      <label>
        Puan (1–5):
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          required
        />
      </label>
      <label>
        Yorum:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
};

export default RecipeReviewForm;
