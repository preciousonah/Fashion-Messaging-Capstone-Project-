import "./Main.css";
import { useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";

function Main() {
  const { user, updateUser } = useContext(UserContext);

  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <div className="main">
      <header className="header">
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
      </header>
      <div className="posts-container">
        <h2>Welcome!</h2>
        {user ? (
          <p>You are logged in as {user.username}</p>
        ) : (
          <p>Please login to access the main content.</p>
        )}
      </div>
    </div>
  );
}

export default Main;