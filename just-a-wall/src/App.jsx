import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, RotateCw, ZoomIn, ZoomOut, Lock, Eye } from 'lucide-react';
import axios from 'axios';

export default function VirtualWall() {
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Security key - change this to your own secret
  const SECURITY_KEY = '1ft81b';

  // Load images from storage on mount
  useEffect(() => {
    loadImages();
    checkEditMode();
  }, []);

  const checkEditMode = () => {
    const path = window.location.pathname;
    if (path.includes('/edit')) {
      setIsEditMode(true);
      setShowAuthModal(true);
    }
  };

  const loadImages = async () => {
    try {
      const response = await axios.get('/api/images');
      if (response.data && Array.isArray(response.data.images)) {
        setImages(response.data.images);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const saveImages = async (newImages) => {
    try {
      await axios.post('/api/images', { images: newImages });
    } catch (error) {
      console.error('Failed to save images:', error);
    }
  };

  const handleAuth = () => {
    if (password === SECURITY_KEY) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
    } else {
      alert('Incorrect password!');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          src: event.target.result,
          x: Math.random() * 300 + 50,
          y: Math.random() * 200 + 50,
          width: 200,
          height: 200,
          rotation: 0,
          shape: 'rectangle'
        };
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        saveImages(updatedImages);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCanvasClick = (e) => {
    // Only deselect if clicking on the canvas background
    if (e.target.classList.contains('canvas-background')) {
      setSelectedId(null);
    }
  };

  const handleMouseDown = (e, id) => {
    if (!isEditMode || !isAuthenticated) return;
    if (e.target.classList.contains('resize-handle')) return;
    e.preventDefault();
    e.stopPropagation();
    const img = images.find(i => i.id === id);
    setDraggedId(id);
    setSelectedId(id);
    setDragOffset({
      x: e.clientX - img.x,
      y: e.clientY - img.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggedId) {
      const updatedImages = images.map(img => 
        img.id === draggedId
          ? { ...img, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
          : img
      );
      setImages(updatedImages);
    } else if (resizing) {
      const img = images.find(i => i.id === resizing);
      const dx = e.clientX - (img.x + img.width);
      const dy = e.clientY - (img.y + img.height);
      const newWidth = Math.max(50, img.width + dx);
      const newHeight = Math.max(50, img.height + dy);
      
      const updatedImages = images.map(i => 
        i.id === resizing
          ? { ...i, width: newWidth, height: newHeight }
          : i
      );
      setImages(updatedImages);
    }
  };

  const handleMouseUp = () => {
    if (draggedId || resizing) {
      saveImages(images);
    }
    setDraggedId(null);
    setResizing(null);
  };

  useEffect(() => {
    if (isEditMode && isAuthenticated) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedId, dragOffset, resizing, images, isEditMode, isAuthenticated]);

  const rotateImage = (id) => {
    const updatedImages = images.map(img =>
      img.id === id ? { ...img, rotation: (img.rotation + 45) % 360 } : img
    );
    setImages(updatedImages);
    saveImages(updatedImages);
  };

  const changeShape = (id, shape) => {
    const updatedImages = images.map(img =>
      img.id === id ? { ...img, shape } : img
    );
    setImages(updatedImages);
    saveImages(updatedImages);
  };

  const deleteImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    saveImages(updatedImages);
    setSelectedId(null);
  };

  const scaleImage = (id, factor) => {
    const updatedImages = images.map(img =>
      img.id === id ? { 
        ...img, 
        width: Math.max(50, img.width * factor),
        height: Math.max(50, img.height * factor)
      } : img
    );
    setImages(updatedImages);
    saveImages(updatedImages);
  };

  const getShapeClip = (shape) => {
    switch(shape) {
      case 'circle':
        return 'circle(50%)';
      case 'rounded':
        return 'inset(0 round 20px)';
      case 'hexagon':
        return 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      default:
        return 'none';
    }
  };

  const selected = images.find(img => img.id === selectedId);

  // Auth Modal
  if (showAuthModal) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-6">
            <Lock size={48} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Editor Authentication</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="Enter security key"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Unlock Editor
          </button>
          <a
            href="/"
            className="block text-center mt-4 text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to View Mode
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
      {/* Toolbar - Only in Edit Mode */}
      {isEditMode && isAuthenticated && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex gap-4 items-center z-10">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <Lock size={20} />
            Editor Mode
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <Upload size={20} />
            Upload Images
          </button>
          
          {selectedId && (
            <>
              <div className="w-px h-8 bg-gray-300" />
              <button
                onClick={() => rotateImage(selectedId)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Rotate"
              >
                <RotateCw size={20} />
              </button>
              <button
                onClick={() => scaleImage(selectedId, 1.2)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => scaleImage(selectedId, 0.8)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <select
                value={selected.shape}
                onChange={(e) => changeShape(selectedId, e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="rectangle">Rectangle</option>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
                <option value="hexagon">Hexagon</option>
                <option value="triangle">Triangle</option>
                <option value="star">Star</option>
              </select>
              <button
                onClick={() => deleteImage(selectedId)}
                className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      )}

      {/* View Mode Indicator */}
      {!isEditMode && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2 z-10">
          <Eye size={20} className="text-blue-500" />
          <span className="font-semibold">View Mode</span>
        </div>
      )}

      {/* Canvas */}
      <div 
        className="canvas-background w-full h-full relative"
        onClick={handleCanvasClick}
      >
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              position: 'absolute',
              left: img.x,
              top: img.y,
              width: img.width,
              height: img.height,
              transform: `rotate(${img.rotation}deg)`,
              cursor: isEditMode && isAuthenticated ? (draggedId === img.id ? 'grabbing' : 'grab') : 'default',
              zIndex: selectedId === img.id ? 100 : 1
            }}
            onMouseDown={(e) => handleMouseDown(e, img.id)}
            className="select-none"
          >
            <img
              src={img.src}
              alt="uploaded"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                clipPath: getShapeClip(img.shape),
                boxShadow: selectedId === img.id && isEditMode ? '0 0 0 3px #3b82f6' : '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: img.shape === 'rounded' ? '20px' : '0'
              }}
              className="pointer-events-none"
            />
            
            {selectedId === img.id && isEditMode && isAuthenticated && (
              <div
                className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize"
                style={{ transform: 'translate(50%, 50%)' }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setResizing(img.id);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            {isEditMode && isAuthenticated ? (
              <>
                <Upload size={64} className="mx-auto mb-4" />
                <p className="text-xl">Click "Upload Images" to start building your wall</p>
              </>
            ) : (
              <>
                <Eye size={64} className="mx-auto mb-4" />
                <p className="text-xl">No images on the wall yet</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}