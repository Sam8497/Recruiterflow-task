import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

import "./carditems.css";

const CardItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("https://6301a75d9a1035c7f804ccb5.mockapi.io/CardDetails")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://6301a75d9a1035c7f804ccb5.mockapi.io/CardDetails/${id}`
      );
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container">
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
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
                aria-label="Delete item"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardItems;
