import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';

const AddProduct = () => {
  const navigate = useNavigate();
  const fixedCategories = [
    { key: 'fashion', name: 'Fashion' },
    { key: 'electronics', name: 'Electronics' },
    { key: 'food', name: 'Food' },
    { key: 'home', name: 'Home' },
    { key: 'gaming', name: 'Gaming' }
  ];
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_slug: '',
    stock: '',
    images: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {}, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    setForm({
      ...form,
      images: [...form.images, ...files]
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setForm({
        ...form,
        images: [...form.images, ...files]
      });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onPaste = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const items = e.clipboardData.items;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        files.push(items[i].getAsFile());
      }
    }
    if (files.length > 0) {
      setForm({
        ...form,
        images: [...form.images, ...files]
      });
    }
  };

  const removeImage = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index)
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const created = await productsAPI.createProduct(form);
      navigate(`/product/${created.id}`);
    } catch (err) {
      setError('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h1>Add Product</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="add-product-form">
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category_slug" value={form.category_slug} onChange={onChange} required>
            <option value="">Select category</option>
            {fixedCategories.map(c => (
              <option key={c.key} value={c.key}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Stock/Quantity</label>
          <input 
            type="number" 
            name="stock" 
            value={form.stock} 
            onChange={onChange} 
            min="0"
            placeholder="Enter available quantity"
            required 
          />
        </div>
        <div className="form-group">
          <label>Images</label>
          <div 
            className={`image-upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onPaste={onPaste}
            tabIndex={0}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '150px',
              backgroundColor: dragActive ? '#f0f0f0' : '#fafafa'
            }}
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={onFiles} 
              id="file-input" 
              style={{display: 'none'}} 
            />
            <label 
              htmlFor="file-input" 
              style={{
                cursor: 'pointer',
                display: 'block',
                padding: '20px',
                color: '#666'
              }}
            >
              📁 Click to upload, drag & drop, or paste (Ctrl+V) images here
            </label>
            {form.images.length > 0 && (
              <div 
                className="image-preview-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '10px',
                  marginTop: '20px'
                }}
              >
                {form.images.map((img, i) => (
                  <div 
                    key={i} 
                    className="image-preview-item"
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid #ddd'
                    }}
                  >
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt={`Preview ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'rgba(255, 0, 0, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        lineHeight: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <small style={{display: 'block', marginTop: '8px', color: '#666'}}>
            {form.images.length} image(s) selected
          </small>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;