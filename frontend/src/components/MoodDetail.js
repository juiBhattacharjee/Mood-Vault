// components/MoodDetail.js (Reading the URL Param)
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './MoodDetail.css'
import axios from 'axios';

const MoodDetail = () => {
  const { id } = useParams(); // Grabbing the ID from the URL string
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/moods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Find the specific item from the user's array
      const currentItem = res.data.find(i => i._id === id);
      setItem(currentItem);
    };
    fetchItem();
  }, [id]);

  if (!item) return <p>Loading...</p>;

  // return (
  //   <div className="detail-view">
  //     <img src={item.imageUrl} alt={item.title} />
  //     <h1>{item.title}</h1>
  //     <span className="tag">{item.moodTag}</span>
  //     <p>{item.notes}</p>
  //   </div>
  // );
  return (
  <div className="detail-wrapper">
    {/* Navigation row to jump back safely */}
    <div className="detail-nav">
      <button onClick={() => navigate('/dashboard')} className="back-btn">
        ← Back to Dashboard
      </button>
    </div>

    <div className="detail-view-container">
      {/* Visual Showcase Section */}
      <div className="detail-media-pane">
        <img src={item.imageUrl} alt={item.title} className="detail-hero-img" />
        <div className="media-overlay-glow" style={{ backgroundImage: `url(${item.imageUrl})` }} />
      </div>
      
      {/* Text Context Pane */}
      <div className="detail-content-pane">
        <div className="detail-header">
          <span className={`detail-tag tag-${item.moodTag?.toLowerCase()}`}>
            {item.moodTag}
          </span>
          <h1 className="detail-title">{item.title}</h1>
        </div>
        
        <div className="detail-body">
          <label className="body-label">Notes & Thoughts</label>
          <p className="detail-notes">
            {item.notes || "No notes added to this mood card yet."}
          </p>
        </div>

        <div className="detail-footer-meta">
          <p className="vault-stamp">Secured in MoodVault</p>
        </div>
      </div>
    </div>
  </div>
);
};
export default MoodDetail;