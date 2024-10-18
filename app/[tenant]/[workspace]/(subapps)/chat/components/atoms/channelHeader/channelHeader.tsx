'use client';

import {Users} from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react';
import {getDisplayNickName} from '../../../services/services';
import {User} from '../../../types/types';

export const ChannelHeader = ({
  users,
  channelName,
}: {
  users: User[];
  channelName: string;
}) => {
  const [showUserPopup, setShowUserPopup] = useState<boolean>(false);
  const userPopupRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const toggleUserPopup = () => {
    setShowUserPopup(!showUserPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserPopup &&
        userPopupRef.current &&
        userButtonRef.current &&
        !userPopupRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserPopup]);
  return (
    <div className="bg-gray-100 p-4 border-b">
      <div className="flex flex-col items-start">
        <h2 className="font-semibold text-xl mb-2">#{channelName}</h2>
        {/* <div className="relative">
          <button
            ref={userButtonRef}
            onClick={toggleUserPopup}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <Users size={16} className="mr-1" />
            <span>{users ? users.length : 0}</span>
          </button>
          {showUserPopup && (
            <div
              ref={userPopupRef}
              className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
              <div className="p-2 border-b border-gray-200">
                <h3 className="font-semibold">Membres du channel</h3>
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {users &&
                  users.map((user: User) => (
                    <li key={user.id} className="p-2">
                      {getDisplayNickName(user.nickname) || user.username}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
