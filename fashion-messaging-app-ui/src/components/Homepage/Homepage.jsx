import Navbar from "../Navbar/Navbar";
import FashionItems from "../FashionItems/FashionItems";
import Search from "../Search/Search";
import "./Homepage.css";


function Homepage({photos, handleSearch}) {
  return (
    <div>
        <div className="container">

            <Navbar />
            <h1>Aesthetik.</h1>
            <Search onSearch={handleSearch} />

        </div>
            <FashionItems photos={photos} />
    </div>
  );
}

export default Homepage;
