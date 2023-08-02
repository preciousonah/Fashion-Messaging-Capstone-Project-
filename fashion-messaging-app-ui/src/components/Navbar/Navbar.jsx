import * as React from "react";
import "./Navbar.css";
import Tooltip from "../Tooltip/Tooltip";

export default function Navbar() {
  const links = [
    { text: "Recommended Outfits!", url: "/recommendations", label: "Recommendations" },
    { text: "Shop Ideas", url: "/", label: "Shopping" },
    { text: "Open Messages", url: "/contact", label: "Messages" },
    { text: "Make a Post!", url: "/post", label: "Post" },
  ];

  return (
    <nav className="navbar">
    <ul className="navbar-list">
      {links.map((link, index) => (
        <li key={index} className="navbar-item">
          <Tooltip text={link.text}>
            <a href={link.url} className="navbar-link">{link.label}</a>
          </Tooltip>
        </li>
      ))}
    </ul>
  </nav>
  );
}
