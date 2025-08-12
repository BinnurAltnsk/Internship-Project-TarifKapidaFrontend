import React from "react";

const StarRating = ({ value = 0, onChange, size = 28, disabled = false }) => {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: size,
            color: star <= value ? "#FFD600" : "#ccc",
            cursor: disabled ? "default" : "pointer",
            transition: "color 0.2s"
          }}
          onClick={() => !disabled && onChange && onChange(star)}
          onMouseOver={e => {
            if (!disabled) e.target.style.color = "#FFD600";
          }}
          onMouseOut={e => {
            if (!disabled) e.target.style.color = star <= value ? "#FFD600" : "#ccc";
          }}
          role="button"
          aria-label={star + " yıldız"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating; 