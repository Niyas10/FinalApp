import React, { useState } from 'react';

const ProductModal = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button onClick={handleOpenModal}>View Product</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>

            <div className="modal-header">
              <img src={product.image} alt={product.title} />
              <h2>{product.title}</h2>
            </div>

            <p>{product.description}</p>

            <div className="modal-footer">
              <p>Rating: {product.rating.rate}</p>
              <p>Rated by: {product.rating.count} customers</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;