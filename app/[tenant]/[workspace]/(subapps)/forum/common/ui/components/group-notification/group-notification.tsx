'use client';
import React, {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Avatar,
  AvatarImage,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@/ui/components';
import {getImageURL} from '@/utils/image';

// ---- LOCAL IMPORTS ---- //
import {NOTIFICATIONS_OPTIONS} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';
import {Group} from '@/subapps/forum/common/types/forum';
import {addNotificationsToGroup} from '@/subapps/forum/common/action/action';

interface groupNotificationPros {
  group: Group;
}

export const GroupNotification = ({group}: groupNotificationPros) => {
  const [selectedOption, setSelectedOption] = useState<string | null>('');
  const {forumGroup, id, notificationSelect, isPin} = group;

  useEffect(() => {
    setSelectedOption(notificationSelect);
  }, []);

  const handleChange = async (notificationType: string) => {
    const {id, version} = group;
    await addNotificationsToGroup({id, version, notificationType});
    setSelectedOption(notificationType);
  };

  return (
    <div className="py-4">
      <div className="w-full grid grid-cols-[1fr_4fr] my-4 ">
        <div className="flex items-center gap-3">
          <Avatar className="rounded-full h-6 w-6">
            <AvatarImage
              src={
                getImageURL(group.forumGroup?.image?.id) ??
                '/images/no-image.png'
              }
            />
          </Avatar>
          <span className="text-sm">{i18n.get(forumGroup.name)}</span>
        </div>
        <RadioGroup
          className="grid grid-cols-4 text-center"
          onValueChange={handleChange}>
          {NOTIFICATIONS_OPTIONS.map(item => (
            <div key={item.id} className="flex items-center justify-center">
              <RadioGroupItem
                value={item.value}
                id={item.value}
                checked={selectedOption === item.value}
                className={`border-muted-foreground ${selectedOption === item.value ? ' border-success text-success' : 'border text-white'}`}
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
