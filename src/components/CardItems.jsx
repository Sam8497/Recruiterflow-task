import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";

import "./carditems.css";

const CardItems = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    title: "",
    body: ""
  });
  const [deletingCardId, setDeletingCardId] = useState(null);

  useEffect(() => {
    axios
      .get("https://6301a75d9a1035c7f804ccb5.mockapi.io/CardDetails")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = async (id) => {
    if (deletingCardId) {
      return;
    }

    setDeletingCardId(id);
    
    try {
      await axios.delete(
        `https://6301a75d9a1035c7f804ccb5.mockapi.io/CardDetails/${id}`
      );
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setTimeout(() => {
        setDeletingCardId(null);
      }, 500);
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!newItemData.title.trim() || !newItemData.body.trim()) {
      alert("Please fill in both title and description fields");
      return;
    }

    try {
      const response = await axios.post("https://6301a75d9a1035c7f804ccb5.mockapi.io/CardDetails", newItemData);
      setItems((prevItems) => [response.data, ...prevItems]);
      setNewItemData({ title: "", body: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewItemData({ title: "", body: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <button className="add-btn" onClick={handleAdd}>
        <FaPlus style={{ marginRight: '8px' }} /> Add New Item
      </button>
      <div className="card-list">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <button
                className={`delete-btn ${deletingCardId === item.id ? 'disabled' : ''}`}
                onClick={() => handleDelete(item.id)}
                disabled={deletingCardId === item.id}
                aria-label="Delete item"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Item</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newItemData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="body">Description</label>
                  <textarea
                    id="body"
                    name="body"
                    value={newItemData.body}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows="4"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={handleSubmit}>
                  Add Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardItems;
