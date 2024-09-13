import React, {useEffect, useState, useRef} from 'react';
import {Hash, ChevronDown, Plus, Search, GripVertical} from 'lucide-react';

export const ChannelList = ({
  channels,
  activeChannel,
  setActiveChannel,
  token,
}: {
  channels: any;
  activeChannel: any;
  setActiveChannel: any;
  token: any;
}) => {
  const [width, setWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 150 && newWidth < 500) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!channels) {
    return <div className="text-gray-400 p-4">Chargement des canaux...</div>;
  }

  return (
    <div
      ref={sidebarRef}
      className="flex flex-col h-[calc(100vh-120px)] bg-gray-800 text-gray-100 relative flex-shrink-0"
      style={{width: `${width}px`}}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Canaux</h2>
        </div>
        <div className="flex items-center bg-gray-900 rounded p-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher des canaux"
            className="bg-transparent text-sm w-full focus:outline-none"
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-grow">
        {channels.map((channel: any) => (
          <div
            key={channel.id}
            className={`flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer ${
              channel.id === activeChannel ? 'bg-blue-600' : ''
            } ${channel.unread ? 'font-semibold' : ''}`}
            onClick={() => setActiveChannel(channel.id)}>
            <div className="flex items-center">
              <Hash size={16} className="mr-2 text-gray-400" />
              <span>{channel.display_name}</span>
            </div>
            {channel.unread > 0 && (
              <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-bold">
                {channel.unread}
              </span>
            )}
          </div>
        ))}
      </div>
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
        onMouseDown={() => setIsResizing(true)}>
        <GripVertical size={20} className="text-gray-400" />
      </div>
    </div>
  );
};
