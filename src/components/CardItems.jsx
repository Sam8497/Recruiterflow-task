import React, { useEffect, useState } from "react";
import "./carditems.css";
import axios from "axios";

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
    <div>
      {items.map((item) => (
        <div
          key={item.id}
        >
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <button
            onClick={() => handleDelete(item.id)}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default CardItems;
