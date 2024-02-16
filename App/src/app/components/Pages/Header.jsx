import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
      <div className="container d-flex justify-content-between align-items-center py-3">
          {/* Logo and Brand Name */}
          <Link to="/" className="navbar-brand">
            LuckyPanda
          </Link>

          {/* Navbar Links */}
          <ul className="navbar-nav d-flex flex-row">
            {/* Since Link does not accept className, we need to wrap it around an <a> tag */}
            <li className="nav-item px-4">

            <Link to="/create-lottery" className="nav-link px-2">
              Create Lottery
            </Link>
            </li>
            <li className="nav-item px-4">
            <Link to="/lucky-draw-collections" className="nav-link px-2">
              Lucky Draw Collection
            </Link>
            </li>
            </ul>
            
        </div>
      </nav>
    </header>
  );
}
