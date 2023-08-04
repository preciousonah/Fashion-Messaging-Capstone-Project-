import * as React from "react";
import "./Navbar.css";


export default function Navbar() {
  return (
    <nav className="navbar">
      
        <ul>
          <li><a href="/recommendations">Recommendations</a></li>
          <li><a href="/post">Post</a></li>
          <li><a href="/">Home</a></li>
        </ul>
    </nav>
  );
}
