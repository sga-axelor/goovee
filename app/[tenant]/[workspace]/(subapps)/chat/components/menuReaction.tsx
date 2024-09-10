import React from 'react';

const MenuReaction = () => {
  return (
    <div className="absolute right-0 top-0 mt-[-20px] mr-2">
      <div className="bg-white shadow-md rounded-full p-1 flex space-x-1">
        <button className="hover:bg-gray-200 rounded-full p-1">👍</button>
        <button className="hover:bg-gray-200 rounded-full p-1">😄</button>
        <button className="hover:bg-gray-200 rounded-full p-1">😮</button>
        <button className="hover:bg-gray-200 rounded-full p-1">😢</button>
        <button className="hover:bg-gray-200 rounded-full p-1">❤️</button>
      </div>
    </div>
  );
};

export default MenuReaction;
