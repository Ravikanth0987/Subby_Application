import React, { useState } from 'react';
import { itemData } from '../data';

const ItemsDisplay = () => {
  const [displayItem, setDisplayItem] = useState(itemData);

  return (
    <div className="itemSection">
      {displayItem.map((items) => {
        return (
          <div className="gallery" key={items.item_img}>
            <img src={items.item_img} alt="food item" />
          </div>
        );
      })}
    </div>
  );
};

export default ItemsDisplay;