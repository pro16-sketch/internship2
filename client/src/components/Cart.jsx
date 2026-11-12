import React from "react";

function Cart({ cart, onClose, onUpdate, onRemove, onCheckout }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="overlay">
      <div className="cart-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Your Shopping Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toLocaleString("en-IN")}</p>

                  <div className="quantity">
                    <button onClick={() => onUpdate(item.id, -1)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => onUpdate(item.id, 1)}>
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-total">
              <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>

              <button className="primary-btn full-btn" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;