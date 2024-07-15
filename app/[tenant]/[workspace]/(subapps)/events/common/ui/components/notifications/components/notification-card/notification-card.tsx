import type {NotificationProps} from './types';

const parseText = (text: string) => {
  const regex = /(@\w+:?)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      if (part.endsWith(':')) {
        return (
          <span key={index}>
            <span className="text- font-semibold">{part.slice(0, -1)}</span>
            <span className="text-success font-semibold">:</span>
            <span className="font-semibold">{parts[index + 1]}</span>
          </span>
        );
      }
      return (
        <span key={index} className="text-success font-semibold">
          {part}
        </span>
      );
    } else if (index > 0 && parts[index - 1].endsWith(':')) {
      return null;
    } else {
      return <span key={index}>{part}</span>;
    }
  });
};

export const NotificationCard = ({time, text, read}: NotificationProps) => {
  return (
    <div className={`px-4 py-2 flex items-center ${!read ? 'gap-x-4' : ''} `}>
      {!read && (
        <span className="size-2 bg-success rounded-full shrink-0"></span>
      )}
      <div>
        <p className="text-xs font-normal line-clamp-2">{parseText(text)}</p>
        <p className="text-[0.688rem] font-normal text-grey-7 dark:text-grey-8">
          {time}
        </p>
      </div>
    </div>
  );
};
