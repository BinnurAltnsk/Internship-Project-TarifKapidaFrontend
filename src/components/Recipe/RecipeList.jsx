import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetailModal from "./RecipeDetailModal";
import "./RecipeList.css";

const RecipeList = ({ recipes, favorites, onAddFavorite, onRemoveFavorite, user }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  // Kategorileri tariflerden çıkar
  const categories = [...new Set(recipes.map(recipe => 
    recipe.category || recipe.recipeCategory
  ).filter(Boolean))];

  // Seçili kategoriye göre tarifleri filtrele
  const filteredRecipes = selectedCategory 
    ? recipes.filter(recipe => 
        (recipe.category || recipe.recipeCategory) === selectedCategory
      )
    : recipes;

  return (
    <div className="recipe-list">
      <div className="recipe-list-header">
        <h1 className="recipe-list-title">Lezzetli Tarifler</h1>
        <p className="recipe-list-subtitle">
          {filteredRecipes.length} tarif bulundu
        </p>
      </div>

      {categories.length > 0 && (
        <div className="recipe-filters">
          <button
            className={`filter-button ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory("")}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <div className="recipe-grid-empty">
          <div className="recipe-grid-empty-icon">🍽️</div>
          <div className="recipe-grid-empty-text">Tarif bulunamadı</div>
          <div className="recipe-grid-empty-subtext">
            {selectedCategory 
              ? `${selectedCategory} kategorisinde tarif bulunamadı.`
              : "Henüz tarif eklenmemiş."
            }
          </div>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => {
            const isFavorite = favorites.some((fav) => 
              fav.recipeId === recipe.recipeId || fav.recipeId === recipe.id
            );

            return (
              <RecipeCard
                key={recipe.recipeId || recipe.id}
                recipe={recipe}
                isFavorite={isFavorite}
                onAddFavorite={() => onAddFavorite(recipe.recipeId || recipe.id)}
                onRemoveFavorite={() => onRemoveFavorite(recipe.recipeId || recipe.id)}
                onClick={handleCardClick}
              />
            );
          })}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
          user={user}
        />
      )}
    </div>
  );
};

export default RecipeList;
