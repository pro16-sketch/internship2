import React, { useState } from "react";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import AuthModal from "./components/AuthModal";

import products from "./data/products";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(products.map(p => p.category))
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function addToCart(product) {
    setCart(previous => {
      const existing = previous.find(item => item.id === product.id);

      if (existing) {
        return previous.map(item =>
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }

      return [...previous, {...product, quantity: 1}];
    });

    setSelectedProduct(null);
  }

  function updateQuantity(id, change) {
    setCart(previous =>
      previous
        .map(item =>
          item.id === id
            ? {...item, quantity: item.quantity + change}
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeItem(id) {
    setCart(previous => previous.filter(item => item.id !== id));
  }

  function checkout() {
    if (!user) {
      setShowCart(false);
      setShowAuth(true);
      alert("Please login before placing your order.");
      return;
    }

    if (cart.length === 0) return;

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const confirmed = window.confirm(
      `Confirm your order of ₹${total.toLocaleString("en-IN")}?`
    );

    if (confirmed) {
      const order = {
        orderId: "ORD" + Date.now(),
        customer: user.email,
        items: cart,
        total,
        date: new Date().toISOString()
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("shopsphere_orders") || "[]"
      );

      localStorage.setItem(
        "shopsphere_orders",
        JSON.stringify([...existingOrders, order])
      );

      setCart([]);
      setShowCart(false);

      alert(`Order placed successfully! Order ID: ${order.orderId}`);
    }
  }

 function handleLogin(authData) {
  setUser(authData.user);

  localStorage.setItem("shopsphere_token", authData.token);
  localStorage.setItem(
    "shopsphere_user",
    JSON.stringify(authData.user)
  );

  setShowAuth(false);
}
    if (!user) {
    return (
      <AuthModal
        required={true}
        onLogin={handleLogin}
        onClose={() => {}}
      />
    );
  }

  return (
    <div className="app">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
        onLoginClick={() => setShowAuth(true)}
        onHome={() => {
          setSelectedProduct(null);
          setShowCart(false);
        }}
        user={user}
      />

      <main>
        <section className="hero">
          <div>
            <span className="hero-tag">WELCOME TO SHOPSPHERE</span>

            <h1>
              Everything you need.
              <br />
              <span>One destination.</span>
            </h1>

            <p>
              Discover quality products, explore exciting collections
              and enjoy a seamless shopping experience.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                document.getElementById("products").scrollIntoView({
                  behavior: "smooth"
                })
              }
            >
              Explore Products →
            </button>
          </div>
        </section>

        <section className="shop-section" id="products">
          <div className="section-heading">
            <div>
              <span className="category">OUR COLLECTION</span>
              <h2>Explore Products</h2>
            </div>

            <span>{filteredProducts.length} products</span>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={setSelectedProduct}
                onAdd={addToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="empty-cart">No products found.</p>
          )}
        </section>
      </main>

      <footer>
        <div className="logo">
          Shop<span>Sphere</span>.
        </div>

        <p>© 2026 ShopSphere. All rights reserved.</p>
      </footer>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      )}

      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdate={updateQuantity}
          onRemove={removeItem}
          onCheckout={checkout}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;