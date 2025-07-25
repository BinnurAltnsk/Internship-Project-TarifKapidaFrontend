import React from "react";
import "./RecipeCard.css";

const RecipeCard = ({ title, imageUrl, calories, ingredients, recipeInstructions, prepTime, isVegetarian, missingIngredients = [], userIngredients = [], onClick, showIngredients = false, isFavorite = false, onFavoriteClick, user }) => {
  // Malzemeleri diziye çevir (virgül veya satır başına göre)
  let ingredientList = [];
  if (typeof ingredients === "string") {
    ingredientList = ingredients.split(/,|\n/).map(i => i.trim()).filter(Boolean);
  } else if (Array.isArray(ingredients)) {
    ingredientList = ingredients;
  }

  return (
    <div className="recipe-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined, position: "relative" }}>
      <img 
        src={imageUrl} 
        alt={title} 
        className="recipe-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Tarif+Resmi";
        }}
      />
      {/* Favori butonu */}
      {user && (
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={e => { e.stopPropagation(); if (onFavoriteClick) onFavoriteClick(); }}
          aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}
      <div className="recipe-content">
        <h2 className="recipe-title">{title}</h2>
        {showIngredients ? (
          <>
            <div className="recipe-meta">
              <span>🔥 {calories} kalori</span>
              <span>⏱️ {prepTime} dk</span>
              {isVegetarian && <span>🌱 Vejetaryen</span>}
            </div>
            <div className="recipe-ingredients">
              <strong>Malzemeler:</strong>
              {ingredientList.map((item, idx) => {
                const itemLower = item.toLowerCase();
                const isMissing = missingIngredients.includes(itemLower);
                const isUserHas = userIngredients.includes(itemLower);
                return (
                  <div key={idx} className="ingredient-item">
                    <div className="ingredient-name">
                      {isUserHas && <span className="ingredient-check">✔</span>}
                      {item}
                    </div>
                    {isMissing && (
                      <a
                        href={`https://www.amazon.com.tr/s?k=${encodeURIComponent(item)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="amazon-btn"
                        onClick={e => e.stopPropagation()}
                      >
                        Amazon'dan al
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="recipe-meta">
            <span>🔥 {calories} kalori</span>
            <span>⏱️ {prepTime} dk</span>
            {isVegetarian && <span>🌱 Vejetaryen</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
