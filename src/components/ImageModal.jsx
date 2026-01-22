import React from 'react';

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        cursor: 'zoom-out'
      }}
    >
      <img 
        src={imageUrl} 
        alt="Enlarged" 
        style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', boxShadow: '0 0 20px rgba(255,255,255,0.2)' }} 
        onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click vào chính cái ảnh
      />
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '30px', background: 'none',
          border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer'
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default ImageModal;