
import React from "react";

function Navbar({
  cartCount,
  onCartClick,
  onLoginClick,
  onHome,
  onLogout,
  user
}) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={onHome}>
        Shop<span>Sphere</span>.
      </div>

      <div className="nav-links">
        <button onClick={onHome}>Home</button>

        <button onClick={onCartClick}>
          Cart ({cartCount})
        </button>

        {user ? (
          <>
            <span className="welcome-user">
              Hi, {user.name}
            </span>
            <button className="login-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
