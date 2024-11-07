import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';

const UserProfile = () => {
  const { currentColor, setIsClicked, user, setUser } = useStateContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.clear();
    setUser(null);
    setIsClicked(prevState => ({
      ...prevState,
      userProfile: false
    }));
    navigate('/login', { replace: true });
  };

  const handleAddProfile = () => {
    setIsClicked(prevState => ({
      ...prevState,
      userProfile: false,
      addProfile: true
    }));
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
          type="button"
          onClick={() => setIsClicked(prevState => ({
            ...prevState,
            userProfile: false
          }))}
          className="text-xl rounded-full p-3 hover:bg-light-gray block"
        >
          <MdOutlineCancel />
        </button>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={user?.profilePic || avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">{user?.name || 'Guest'}</p>
          <p className="text-gray-500 text-sm dark:text-gray-400">{user?.email || 'guest@example.com'}</p>
        </div>
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={handleAddProfile}
          style={{ backgroundColor: currentColor, color: 'white', borderRadius: '10px' }}
          className="w-full p-3 hover:drop-shadow-xl mb-3"
        >
          Add Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          style={{ backgroundColor: currentColor, color: 'white', borderRadius: '10px' }}
          className="w-full p-3 hover:drop-shadow-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
