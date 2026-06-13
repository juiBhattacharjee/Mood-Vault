import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [moodTag, setMoodTag] = useState('');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  
  // Form State to track input text
  const [formData, setFormData] = useState({ 
    title: '', 
    imageUrl: '', 
    notes: '', 
    moodTag: 'Inspiring' 
  });

  // 1. Optimized Fetch function with cache-busting to prevent 304 freezes
  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(
        `/api/moods?moodTag=${moodTag}&sort=${sort}&search=${search}`, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache', // Fixes the 304 Not Modified caching glitch
            'Pragma': 'no-cache'
          }
        }
      );
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching mood cards:", err);
    }
  };

  // 2. Trigger automated re-fetch smoothly when any filter dependencies change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchItems();
    }
  }, [moodTag, sort, search]);

  // 3. Form submission handler to talk to your backend API
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/moods', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear out the form inputs
      setFormData({ title: '', imageUrl: '', notes: '', moodTag: 'Inspiring' });
      
      // Force a fresh database fetch so the grid adheres perfectly to active filters/sorting rules
      fetchItems(); 
    } catch (err) {
      console.error("Error creating mood card:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/moods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems(); // Dynamic database sync
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  return (
  <div className="dashboard-wrapper">
    <div className="dashboard-container">
      
      {/*  ADD NEW MOOD FORM SECTION */}
      <section className="create-mood-section">
        <div className="section-header">
          <h3>Add to Your Moodboard</h3>
          <p>Capture a moment, feeling, or aesthetic artifact.</p>
        </div>
        
        <form onSubmit={handleCreate} className="create-mood-form">
          <div className="form-row-grid">
            <input 
              type="text" 
              placeholder="Mood Title (e.g., Summer Vibes)" 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="dashboard-input"
            />
            <input 
              type="text" 
              placeholder="Image URL (Paste any online image address)" 
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="dashboard-input"
            />
          </div>
          
          <textarea 
            placeholder="Add some thoughts or notes..." 
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="dashboard-textarea"
          />
          
          <div className="form-actions-row">
            <select 
              value={formData.moodTag}
              onChange={(e) => setFormData({ ...formData, moodTag: e.target.value })}
              className="dashboard-select tag-selector"
            >
              <option value="Inspiring">✨ Inspiring</option>
              <option value="Calm">🍃 Calm</option>
              <option value="Energetic">⚡ Energetic</option>
              <option value="Moody">🌙 Moody</option>
            </select>
            
            <button type="submit" className="save-card-btn">
              Save Mood Card
            </button>
          </div>
        </form>
      </section>

      <div className="section-divider" />

      <div className="toolbar">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search moods..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="dashboard-input"
          />
        </div>
        
        <div className="filter-controls">
          <select value={moodTag} onChange={(e) => setMoodTag(e.target.value)} className="dashboard-select">
            <option value="">All Moods</option>
            <option value="Inspiring">Inspiring</option>
            <option value="Calm">Calm</option>
            <option value="Energetic">Energetic</option>
            <option value="Moody">Moody</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="dashboard-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* DISPLAY GRID */}
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No mood cards found matching those criteria. Add a new one above!</p>
        </div>
      ) : (
        <div className="mood-grid">
          {items.map(item => (
            <div key={item._id} className="mood-card">
              <div className="card-image-wrapper">
                <img src={item.imageUrl} alt={item.title} className="card-img" />
                <span className={`mood-badge badge-${item.moodTag?.toLowerCase()}`}>
                  {item.moodTag}
                </span>
              </div>
              
              <div className="card-content">
                <h4 className="card-title">{item.title}</h4>
                {item.notes && <p className="card-notes">{item.notes}</p>}
                
                <div className="card-footer">
                  <Link to={`/mood/${item._id}`} className="details-link">
                    View Details →
                  </Link>
                  <button onClick={() => handleDelete(item._id)} className="delete-card-btn">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default Dashboard;