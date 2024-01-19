import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    // Check if the stored username matches the current username in the URL
    if (storedUsername !== username) {
      // Redirect to the correct URL
      navigate(`/dashboard/${storedUsername}`, { replace: true });
    } else {
      // Fetch comments and perform other actions
      const fetchAllComments = async () => {
        try {
          const response = await axios.get('https://user-commenter-server.onrender.com/api/comments');
          const allComments = response.data.comments || [];
          const sortedComments = allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setComments(sortedComments);
        } catch (error) {
          handleApiError(error, 'Error fetching all comments');
        }
      };

      const token = localStorage.getItem('token');
      token ? fetchAllComments() : navigate('/');
    }
  }, [navigate, username]);

  const handleComment = async () => {
    if (!comment.trim()) {
      setCommentError('Fill in the textarea.');
      return;
    }

    try {
      const response = await axios.post('https://user-commenter-server.onrender.com/api/comments', { username, comment });
      const newComment = { comment, author: username, timestamp: response.data.user.timestamp };
      const updatedComments = [newComment, ...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setComments(updatedComments);
      setComment('');
      setCommentError('');
    } catch (error) {
      handleApiError(error, 'Comment error');
    }
  };

  const handleApiError = (error, customMessage) => {
    console.error(`${customMessage}:`, error.response?.data?.error || 'Unknown error');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/', { replace: true });
  };

  return (
    <div className='font-inter absolute h-screen w-full bg-white'>
      <div className='bg-white fixed flex items-center h-[60px] justify-between w-full z-10 px-6 text-[14px] font-medium'>
        <div className='flex rounded-lg items-center'>
          <div className='border border-neutral-800 rounded-l-lg py-1 pl-2 pr-1'>Profile</div>
          <div className=' text-neutral-200 border border-neutral-800 bg-neutral-800 px-2 py-1 rounded-r-lg'>{username}</div>
        </div>
        <div className='bg-neutral-400 h-[1px] w-full top-[60px] absolute left-0' />
        <div className='flex items-center'>
          <div className='mx-4 w-[1px] h-6 bg-neutral-400' />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className='absolute top-[60px] text-center w-full p-10 flex flex-col items-center'>
        <div className='mb-2 font-semibold text-md'>Post your comment here:</div>
        <div>
          <textarea
            className='border p-2 w-[300px] h-[80px] border-neutral-500 rounded-lg'
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setCommentError('');
            }}
          />
          {commentError && <p className='text-red-500 text-sm font-semibold absolute h-screen w-full flex justify-center left-0 top-[157px]'>{commentError}</p>}
          <br />
          <button className='rounded-md bg-neutral-800 hover:bg-neutral-900 text-neutral-200 hover:text-white mt-7 px-4 py-1 my-3' onClick={handleComment}>
            Post
          </button>
        </div>
        <h3 className='my-3 mt-6 font-medium'>Comments:</h3>
        <ul className='w-[300px] md:w-[35%]'>
          {comments.map((c, index) => (
            <li className='p-4 rounded-lg mb-6 border border-neutral-500 px-10' key={index}>
              <div className='break-words'>{c.comment}</div>
              <div className='mt-1 font-bold'>{c.author}</div>
            </li>
          ))}
        </ul>
        <br />
      </div>
    </div>
  );
};

export default Dashboard;