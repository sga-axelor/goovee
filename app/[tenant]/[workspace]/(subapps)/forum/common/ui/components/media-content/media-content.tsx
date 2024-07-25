'use client';

export const MediaContent = () => {
  return (
    <div className="w-full bg-white rounded-lg p-4 grid grid-cols-3 gap-3 mt-6">
      {Array.from({length: 30}).map((_, i) => {
        return (
          <div className="w-full h-[9.375rem] bg-slate-200">
            {false && (
              <div className="py-2 px-3 bg-white text-[0.5rem] leading-[0.75rem]">
                File Name
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaContent;
