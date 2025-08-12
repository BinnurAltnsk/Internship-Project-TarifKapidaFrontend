import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipeDetailModal = ({ recipe, user, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");
  const token = localStorage.getItem("token");

  // Yorumları getir
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Review/PagedReviewsByRecipe?recipeId=${recipe.recipeId}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Yorumlar getirilemedi:", err);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Review/GetAverageRating/${recipe.recipeId}`);
        setAverageRating(res.data || 0);
      } catch (err) {
        console.error("Ortalama puan getirilemedi:", err);
      }
    };

    fetchReviews();
    fetchAverageRating();
    setLoading(false);
  }, [recipe.recipeId]);

  // Yeni yorum gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId || !comment || rating === 0) return;

    try {
      await axios.post(`${API_BASE_URL}/api/Review/CreateReview`, {
        recipeId: recipe.recipeId,
        userId: user.userId,
        reviewText: comment,
        rating,
      });
      setComment("");
      setRating(0);
      // Yeniden yorumları ve ortalamayı getir
      const res = await axios.get(`${API_BASE_URL}/api/Review/PagedReviewsByRecipe?recipeId=${recipe.recipeId}`);
      setReviews(res.data || []);
      const ratingRes = await axios.get(`${API_BASE_URL}/api/Review/GetAverageRating/${recipe.recipeId}`);
      setAverageRating(ratingRes.data || 0);
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        <h2>{recipe.recipeName}</h2>
        <img src={recipe.recipeImageUrl} alt={recipe.recipeName} style={{ maxWidth: "100%", height: "auto" }} />
        <p><strong>Açıklama:</strong> {recipe.recipeDescription}</p>
        <p><strong>Malzemeler:</strong> {recipe.recipeIngredients}</p>
        <p><strong>Yapılışı:</strong> {recipe.recipeInstructions}</p>
        <p><strong>Kalori:</strong> {recipe.recipeCalories} kcal</p>
        <p><strong>Hazırlama Süresi:</strong> {recipe.recipePrepTime} dk</p>
        <p><strong>Vejetaryen mi?</strong> {recipe.recipeIsVegetarian ? "Evet" : "Hayır"}</p>
        <p><strong>⭐ Ortalama Puan:</strong> {averageRating.toFixed(1)} / 5</p>

        <hr />

        <h3>💬 Yorumlar</h3>
        {reviews.length === 0 ? (
          <p>Henüz yorum yapılmamış.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.reviewId}>
                <strong>{review.username || "Anonim"}:</strong> {review.reviewText} ⭐{review.rating}
              </li>
            ))}
          </ul>
        )}

        {user?.userId && (
          <>
            <h3>Yorum Yap</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Yorumunuzu yazın"
                required
              />
              <br />
              <label>
                Puan:
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  min="1"
                  max="5"
                  required
                />
              </label>
              <br />
              <button type="submit">Gönder</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailModal;
