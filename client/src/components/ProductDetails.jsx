
import React, { useState } from "react";

function ProductDetails({ product, onBack, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <section className="product-details-page">

      <button className="back-btn" onClick={onBack}>
        ← Back to Products
      </button>

      <div className="details-layout">

        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-content">

          <span className="category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

         <p className="details-rating">
  ★ {product.rating ?? "N/A"} / 5
</p>

<div className="details-price">
  ₹{Number(product.price || 0).toLocaleString("en-IN")}

  {product.oldPrice && (
    <del>
      ₹{Number(product.oldPrice).toLocaleString("en-IN")}
    </del>
  )}
</div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="product-specs">
            <p><strong>Product:</strong> {product.name}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Availability:</strong> In Stock</p>
          </div>

          <div className="details-quantity">
            <span>Quantity</span>

            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              −
            </button>

            <strong>{quantity}</strong>

            <button
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>

          <h3 className="details-total">
           Total: ₹{(Number(product.price || 0) * quantity).toLocaleString("en-IN")}
          </h3>

          <button
            className="primary-btn details-add-btn"
            onClick={() => {
              onAdd(product, quantity);
              setQuantity(1);
            }}
          >
            Add {quantity} to Cart
          </button>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
