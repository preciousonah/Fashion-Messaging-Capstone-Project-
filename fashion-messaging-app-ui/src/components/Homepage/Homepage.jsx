import "./Homepage.css";
import { useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import FashionItems from "../FashionItems/FashionItems";
import Search from "../Search/Search";

function Homepage({photos, handleSearch, noResults}) {
  const { user, updateUser } = useContext(UserContext);

  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <div>
      <div className="container">
      <h1>Aesthetik.</h1>
        <Navbar />
        <Search onSearch={handleSearch} />

        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>

      </div>
      <FashionItems photos={photos} noResults={noResults} />
    </div>
  );
}

export default Homepage;
