import React from "react";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, isFavorite, onAddFavorite, onRemoveFavorite, onClick }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Kart tıklamasını engelle
    if (isFavorite) {
      onRemoveFavorite();
    } else {
      onAddFavorite();
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  // Tarif verilerini güvenli şekilde al
  const recipeName = recipe?.recipeName || recipe?.title || "Tarif Adı";
  const description = recipe?.description || recipe?.recipeDescription || "Bu tarif için açıklama bulunmuyor.";
  const imageUrl = recipe?.imageUrl || recipe?.recipeImageUrl;
  const category = recipe?.category || recipe?.recipeCategory;
  const cookingTime = recipe?.cookingTime || recipe?.preparationTime || "30";
  const difficulty = recipe?.difficulty || "Orta";
  const rating = recipe?.rating || recipe?.averageRating || 4.5;

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <div className="recipe-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipeName}
            className="recipe-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="recipe-image-placeholder"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          🍽️
        </div>
        
        {category && (
          <div className="recipe-badge">
            {category}
          </div>
        )}
      </div>

      <div className="recipe-info">
        <div className="recipe-header">
          <h3 className="recipe-title">{recipeName}</h3>
          <p className="recipe-description">{description}</p>
        </div>

        <div className="recipe-meta">
          <div className="recipe-meta-item">
            <span className="recipe-meta-icon">⏱️</span>
            <span>{cookingTime} dk</span>
          </div>
          <div className="recipe-meta-item">
            <span className="recipe-meta-icon">🔥</span>
            <span>{difficulty}</span>
          </div>
        </div>

        <div className="recipe-actions">
          <div className="recipe-rating">
            <div className="rating-stars">
              {'⭐'.repeat(Math.floor(rating))}
              {rating % 1 > 0 && '⭐'}
            </div>
            <span className="rating-text">{rating.toFixed(1)}</span>
          </div>

          <button 
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
          >
            <span className="favorite-icon">
              {isFavorite ? '💔' : '❤️'}
            </span>
            {isFavorite ? 'Favoriden Çıkar' : 'Favorilere Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
