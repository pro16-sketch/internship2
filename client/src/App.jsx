import React, { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import AuthModal from "./components/AuthModal";


import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState("");

  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  useEffect(() => {
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5000/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Product fetch error:", error);
      setProductError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);
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

 function addToCart(product, quantity = 1) {
  setCart(previous => {
    const existing = previous.find(item => item.id === product.id);

    if (existing) {
      return previous.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    }

    return [...previous, { ...product, quantity }];
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

 
async function checkout() {
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

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("shopsphere_token");

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Order failed");
    }

    setCart([]);
    setShowCart(false);

    alert(`Order placed successfully! Order ID: ${data.order._id}`);
  } catch (error) {
    console.error("Checkout error:", error);
    alert(error.message);
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
{selectedProduct ? (
  <ProductDetails
    product={selectedProduct}
    onBack={() => setSelectedProduct(null)}
    onAdd={addToCart}
  />
) : (
  <>
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

           <span>
  {loading ? "Loading..." : `${filteredProducts.length} products`}
</span>
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
  {loading ? (
    <p>Loading products...</p>
  ) : productError ? (
    <p className="empty-cart">{productError}</p>
  ) : (
    filteredProducts.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onView={setSelectedProduct}
        onAdd={addToCart}
      />
    ))
  )}
</div>

         {!loading && !productError && filteredProducts.length === 0 && (
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

   
  </>
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