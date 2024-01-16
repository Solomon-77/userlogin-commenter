import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments when the component mounts
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://user-commenter-server.onrender.com/api/comments');
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error.response?.data?.error || 'Unknown error');
      }
    };

    fetchComments();
  }, []);

  // Check if the logged-in user matches the username from the URL parameters
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser !== username) {
      // Redirect to the correct URL
      navigate(`/dashboard/${loggedInUser}`);
    }
  }, [username, navigate]);

  const handleComment = async () => {
    try {
      await axios.post('https://user-commenter-server.onrender.com/api/comments', { username, comment });
      const updatedComments = [...comments, { comment, author: username }];
      setComments(updatedComments);
      setComment('');
    } catch (error) {
      console.error('Comment error:', error.response?.data?.error || 'Unknown error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/', { replace: true });
  };

  return (
    <div>
      <h2>Welcome {username}!</h2>
      <p>This is your dashboard.</p>
      <h3>Comments:</h3>
      <ul>
        {comments.map((c, index) => (
          <li key={index}>{c.comment} - {c.author}</li>
        ))}
      </ul>
      <div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        <br />
        <button onClick={handleComment}>Post Comment</button>
      </div>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
