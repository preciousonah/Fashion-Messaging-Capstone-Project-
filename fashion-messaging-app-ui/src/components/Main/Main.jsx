import "./Main.css"
import { Link } from "react-router-dom";

function Main() {
  
    return (
      <div className="main">
      <header className="header">
        <div className="user-info">
            <Link to="/login">Login</Link>
        </div>
      </header>
      </div>
    )
}

export default Main;