import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThreeViewer from '../components/ThreeViewer';
import './ShoeViewer.css';

function ShoeViewer() {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchShoe();
  }, [id]);

  const fetchShoe = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shoes/${id}`);
      const data = await response.json();
      setShoe(data);
      if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
    } catch (error) {
      console.error('Error fetching shoe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoeId: id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        }),
      });
      const data = await response.json();
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <div className="loader">Loading shoe...</div>;
  if (!shoe) return <div className="error">Shoe not found</div>;

  return (
    <div className="shoe-viewer">
      <div className="container">
        <div className="shoe-detail-grid">
          <div className="viewer-section">
            <ThreeViewer modelUrl={shoe.model3D} shoeName={shoe.name} />
          </div>

          <div className="info-section">
            <h1>{shoe.name}</h1>
            <p className="brand">{shoe.brand}</p>
            <p className="model">Model: {shoe.model}</p>

            <div className="rating">
              <span className="stars">{'⭐'.repeat(Math.round(shoe.rating))}</span>
              <span className="rating-text">{shoe.rating.toFixed(1)} out of 5</span>
              <span className="reviews">({shoe.reviews?.length || 0} reviews)</span>
            </div>

            <div className="price-section">
              <h2 className="price">${shoe.price}</h2>
              <p className={shoe.inStock ? 'in-stock' : 'out-of-stock'}>
                {shoe.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>

            <p className="description">{shoe.description}</p>

            <div className="specifications">
              <h3>Specifications</h3>
              <p><strong>Material:</strong> {shoe.material || 'Not specified'}</p>
              <p><strong>Release Date:</strong> {shoe.releaseDate ? new Date(shoe.releaseDate).toLocaleDateString() : 'N/A'}</p>
            </div>

            <div className="options">
              <div className="option">
                <label>Color:</label>
                <div className="color-buttons">
                  {shoe.colors?.map(color => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="option">
                <label>Size (US):</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  {shoe.sizes?.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="option">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>

            <button 
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={!shoe.inStock}
            >
              {shoe.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {shoe.reviews?.length > 0 && (
              <div className="reviews-section">
                <h3>Customer Reviews</h3>
                {shoe.reviews.map((review, idx) => (
                  <div key={idx} className="review">
                    <div className="review-header">
                      <strong>{review.user}</strong>
                      <span>{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoeViewer;