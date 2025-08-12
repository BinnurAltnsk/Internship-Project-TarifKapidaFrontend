import React from "react";

function IngredientFilterBox({
  inputIngredient,
  setInputIngredient,
  userIngredients,
  setUserIngredients,
  showOnlyPossible,
  setShowOnlyPossible,
}) {
  const handleAddIngredient = () => {
    if (inputIngredient.trim()) {
      setUserIngredients([...userIngredients, inputIngredient.trim().toLowerCase()]);
      setInputIngredient("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setUserIngredients(userIngredients.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "24px auto 0",
        background: "var(--card-bg)",
        color: "var(--text-primary)",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 8px var(--shadow-color)",
        border: "1px solid var(--border-color)",
      }}
    >
      <h3 style={{ color: "var(--text-primary)", marginBottom: 16 }}>
        Elinizdeki Malzemeler
      </h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={inputIngredient}
          onChange={(e) => setInputIngredient(e.target.value)}
          placeholder="Malzeme ekle..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddIngredient();
          }}
        />
        <button
          type="button"
          onClick={handleAddIngredient}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "var(--accent-color)",
            color: "#fff",
            border: "none",
          }}
        >
          Ekle
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {userIngredients.map((ing, idx) => (
          <span
            key={idx}
            style={{
              background: "var(--bg-secondary)",
              color: "var(--accent-color)",
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 15,
              border: "1px solid var(--border-color)",
            }}
          >
            {ing}{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-color)",
                cursor: "pointer",
              }}
              onClick={() => handleRemoveIngredient(idx)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={() => setShowOnlyPossible(!showOnlyPossible)}
        style={{
          padding: "8px 16px",
          borderRadius: 6,
          background: showOnlyPossible ? "var(--text-secondary)" : "var(--accent-color)",
          color: "#fff",
          border: "none",
          marginTop: 8,
        }}
      >
        {showOnlyPossible ? "Tüm Tarifleri Göster" : "Sadece Yapabileceğim Tarifler"}
      </button>
    </div>
  );
}

export default IngredientFilterBox;
