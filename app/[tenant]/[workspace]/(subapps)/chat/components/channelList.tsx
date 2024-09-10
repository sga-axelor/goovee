import React, { useEffect, useState } from "react";
import { Hash, ChevronDown, Plus, Search, Send } from "lucide-react";

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
  const [_channels, setChannels] = useState<any>(null);

  if (!channels) {
    return <div>Chargement</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-100 w-64">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Canaux</h2>
          <ChevronDown size={20} className="text-gray-400" />
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
            className={`flex items-center p-2 hover:bg-gray-700 cursor-pointer ${
              channel.id === activeChannel ? "bg-blue-600" : ""
            } ${channel.unread ? "font-semibold" : ""}`}
            onClick={() => setActiveChannel(channel.id)}
          >
            <Hash size={16} className="mr-2 text-gray-400" />
            <span>{channel.display_name}</span>
            {channel.unread > 0 && (
              <span className="ml-auto bg-blue-500 text-xs px-2 py-1 rounded-full">
                {channel.unread}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center text-gray-400 hover:text-gray-100">
          <Plus size={16} className="mr-2" />
          Ajouter un canal
        </button>
      </div>
    </div>
  );
};
