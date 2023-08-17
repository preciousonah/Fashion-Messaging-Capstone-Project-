import "./Main.css"
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";
import Navbar from '../Navbar/Navbar';

function Main() {
    const { user, updateUser } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({
      title: '',
      content: '',
      credentials: 'include'
    });
  
    useEffect(() => {
      const fetchPosts = async () => {
        const response = await fetch('http://localhost:3000/posts');
        const data = await response.json();
        setPosts(data);
      };
      fetchPosts();
    }, []);

    const handleChange = (event) => {
      if (event.target.name === 'picture') {
        setForm({
          ...form,
          [event.target.name]: event.target.files[0],
        });
      } else {
        setForm({
          ...form,
          [event.target.name]: event.target.value,
        });
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      let formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('picture', form.picture);
    
      try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (!response.ok) {
          throw new Error('Failed to add post.');
         }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);

        } catch (error) {
          console.error('Error adding the post:', error.message);
          alert('An error occurred while adding the post. Try completing the form');
          }
    };

    const handleLogout = () => {
      
      updateUser(null);
    };
    return (
      <div className="main">
             <Navbar /> 
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
        <form className="new-post-form" onSubmit={handleSubmit} encType="multipart/form-data">    
            <input
                type="text"
                name="title"
                placeholder="header"
                value={form.title}
                onChange={handleChange}
            />
            <textarea
                name="content"
                placeholder="caption"
                value={form.content}
                onChange={handleChange}
            />
          <input
              type="file"
              name="picture"
              onChange={handleChange}
            />
            <button type="submit">Click here to Post your favorite outfits!</button>
        </form>
        <div className="posts-container">
          {posts.map((post) => (
          <div className="post" key={post.id}>
              <h2>{post.title}</h2>
              <h4>{post.user.username} at {new Date(post.createdAt).toLocaleString()}</h4>
              <p>{post.content}</p>
              <img className="post-size" src={`http://localhost:3000/images/${post.picture}`} alt="Post" />
          </div>
          ))}
        </div>
      </div>
    )
}

export default Main;