import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './DishList.css'; // Import the CSS file

const DishList = () => {
  const [dishes, setDishes] = useState([]);

  const fetchDishes = async () => {
    const res = await axios.get('http://localhost:5000/api/dishes');
    setDishes(res.data);
  };

  useEffect(() => {
    fetchDishes();

    const socket = io('http://localhost:5000');
    socket.on('update', (updatedDish) => {
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish._id === updatedDish._id ? updatedDish : dish))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const togglePublished = async (dishId) => {
    await axios.post('http://localhost:5000/api/dishes/toggle', { dishId });
    fetchDishes();
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="company-name">Euphotic Labs Private Limited</h1>
      </header>
      <div className="dish-list-container">
        <h2>Dish List</h2>
        <ul className="dish-list">
          {dishes.map(dish => (
            <li key={dish._id} className="dish-item">
              <h3>{dish.dishName}</h3>
              <img src={dish.imageUrl} alt={dish.dishName} className="dish-image"/>
              <p className={dish.isPublished ? 'published' : 'unpublished'}>
                {dish.isPublished ? 'Published' : 'Unpublished'}
              </p>
              <button onClick={() => togglePublished(dish._id)} className="toggle-button">
                Toggle Published
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DishList;
