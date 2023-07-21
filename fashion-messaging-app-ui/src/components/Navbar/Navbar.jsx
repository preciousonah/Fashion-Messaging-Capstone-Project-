import * as React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
        <ul>
          <li><a href="/">Profile</a></li>
          <li><a href="/about">Notifications</a></li>
          <li><a href="/contact">Messages</a></li>
          <li><a href="/post">Post</a></li>
        </ul>
    </nav>
  );
}
