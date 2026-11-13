import React from "react";

function ProductCard({ product, onView, onAdd }) {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        onClick={() => onView(product)}
      />

      <div className="product-info">
        <span className="category">{product.category}</span>

        <h3>{product.name}</h3>

       <p className="rating">★ {product.rating ?? "N/A"}</p>

<div className="price">
  ₹{Number(product.price || 0).toLocaleString("en-IN")}
  {product.oldPrice && (
    <del>
      ₹{Number(product.oldPrice).toLocaleString("en-IN")}
    </del>
  )}
</div>

        <div className="product-actions">
          <button onClick={() => onView(product)}>
            Details
          </button>

          <button className="primary-btn" onClick={() => onAdd(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;