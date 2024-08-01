'use client';
import React, {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {RadioGroup, RadioGroupItem, Separator} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {NOTIFICATIONS_OPTIONS} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';

export const GroupNotification = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div className="py-4">
      <div className="w-full grid grid-cols-[1fr_4fr] my-4 ">
        <div className="flex items-center gap-3">
          {/* Group Image */}
          <div className="w-6 h-6 rounded-md bg-gradient-to-r from-green-300/80 to-sky-800/20"></div>
          <span className="text-sm">{i18n.get('Group name')}</span>
        </div>
        <RadioGroup
          className="grid grid-cols-4 text-center"
          onValueChange={handleChange}>
          {NOTIFICATIONS_OPTIONS.map(item => (
            <div key={item.id} className="flex items-center justify-center">
              <RadioGroupItem
                value={item.title}
                id={item.title}
                className={`border-muted-foreground ${selectedOption === item.title ? ' border-success text-success' : 'border text-white'}`}
              />
            </div>
          ))}
        </RadioGroup>
      </div>
      <Separator />
    </div>
  );
};

export default GroupNotification;
