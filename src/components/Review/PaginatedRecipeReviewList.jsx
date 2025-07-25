import React, { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewService";

const PaginatedRecipeReviewList = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!recipeId) return;

    const fetchReviews = async () => {
      try {
        console.log("API çağrısı yapılıyor:", { recipeId, page, pageSize });
        const result = await reviewService.getPagedReviewsByRecipe(recipeId, page, pageSize);
        console.log("API sonucu:", result);
        setReviews(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error("Yorumlar alınırken hata:", err);
      }
    };

    fetchReviews();
  }, [recipeId, page]);

  const handlePageClick = (pageNum) => {
    console.log("Sayfa değişiyor:", page, "->", pageNum);
    if (pageNum !== page) {
      setPage(pageNum);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Yorumlar Listesi */}
      <div style={{ marginBottom: "20px" }}>
        {reviews.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {reviews.map((r) => (
              <li key={r.reviewId} style={{
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #e0e0e0"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ marginRight: "10px" }}>
                    {[...Array(5)].map((_, index) => (
                      <span key={index} style={{ color: index < r.rating ? "#FFD700" : "#ddd" }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {r.rating}/5
                  </span>
                </div>
                <p style={{ margin: 0, color: "#555", lineHeight: "1.5" }}>
                  {r.reviewText}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
            Bu tarif için henüz yorum bulunmuyor.
          </p>
        )}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
                    <ul style={{
            display: "flex",
            listStyleType: "none",
            padding: 0,
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            {/* Önceki Sayfa */}
            <li
              onClick={() => page > 1 && handlePageClick(page - 1)}
              style={{
                padding: "8px 12px",
                cursor: page > 1 ? "pointer" : "not-allowed",
                backgroundColor: "#fff",
                borderRight: "1px solid #ccc",
                color: page > 1 ? "#333" : "#ccc",
                fontWeight: "bold"
              }}
            >
              «
            </li>

            {/* Sayfa Numaraları */}
            {(() => {
              const maxVisiblePages = 7;
              let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              
              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              
              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }
              
              return pages.map((pageNum) => (
                <li
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    backgroundColor: page === pageNum ? "#4CAF50" : "#fff",
                    color: page === pageNum ? "#fff" : "#000",
                    fontWeight: "bold",
                    borderRight: pageNum !== endPage ? "1px solid #ccc" : "none"
                  }}
                >
                  {pageNum}
                </li>
              ));
            })()}

            {/* Sonraki Sayfa */}
            <li
              onClick={() => page < totalPages && handlePageClick(page + 1)}
              style={{
                padding: "8px 12px",
                cursor: page < totalPages ? "pointer" : "not-allowed",
                backgroundColor: "#fff",
                color: page < totalPages ? "#333" : "#ccc",
                fontWeight: "bold"
              }}
            >
              »
            </li>
          </ul>
        </div>
      )}
    </div>

  );
};

export default PaginatedRecipeReviewList;
