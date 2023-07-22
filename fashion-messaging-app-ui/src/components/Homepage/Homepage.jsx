import Navbar from "../Navbar/Navbar";
import FashionItems from "../FashionItems/FashionItems";
import Search from "../Search/Search";
import "./Homepage.css";
import { Link } from "react-router-dom";

function Homepage({photos, handleSearch}) {
  return (
    <div>
        <div className="container">
        <Link to="/logout">Logout</Link>
            <Navbar />
            <h1>Aesthetik.</h1>
            <Search onSearch={handleSearch} />
        
        </div>
            <FashionItems photos={photos} />
    </div>
  );
}

export default Homepage;
