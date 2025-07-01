'use client';

// ---- CORE IMPORTS ---- //
import {Skeleton} from '@/ui/components';

export function ForumSkeleton() {
  return (
    <div>
      <div className="hidden lg:block">
        <NavMenuSkeleton count={2} />
      </div>
      <BannerSkeleton />
      <div className="container py-6 mx-auto grid grid-cols-1 md:grid-cols-[17.563rem_1fr] gap-5">
        <GroupSkeleton />
        <div className="flex flex-col gap-2">
          <UploadPostSkeleton />
          <PostSkeletonList />
        </div>
      </div>
    </div>
  );
}

export function ForumNotificationSkeleton({count = 10}: {count?: number}) {
  return (
    <section className="py-2 w-full rounded-sm bg-white">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="grid grid-cols-[1fr_4fr] mt-12">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-full h-8" />
          </div>
          <div className="grid grid-cols-4 text-center align-middle text-sm font-normal gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex w-full items-center justify-center">
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function NavMenuSkeleton({count = 2}: {count?: number}) {
  return (
    <div className="bg-white flex items-center justify-center gap-5 px-6 py-4 ">
      {[...Array(count)].map((_, index) => (
        <Skeleton key={index} className="h-8 w-32" />
      ))}
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="relative overflow-hidden flex-col lg:w-auto w-full h-[300px] lg:h-[353px] flex items-center justify-center bg-white mt-4">
      <div className="flex flex-col gap-4 w-full items-center ">
        <Skeleton className="w-20 h-20" />
        <Skeleton className="w-96 h-8" />
        <div className="flex flex-col gap-2 w-full items-center justify-center md:max-w-screen-sm lg:max-w-screen-md">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
        </div>
        <Skeleton className="w-3/5 h-12 md:max-w-screen-sm lg:max-w-screen-md" />
      </div>
    </div>
  );
}

function GroupSkeleton() {
  return (
    <div className="w-full overflow-hidden mb-16 lg:mb-0">
      <div className="h-fit flex flex-col gap-6 bg-white p-4 rounded-lg">
        <Skeleton className="h-6 w-50" />
        <div className="w-full flex gap-2">
          <Skeleton className="w-4/5 h-8" />
          <Skeleton className="w-1/5 h-8" />
        </div>
        <div>
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="flex gap-2  ">
                <AvatarSkeleton />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex gap-2 my-4">
                <AvatarSkeleton />
                <Skeleton className="h-8 w-full " />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AvatarSkeleton() {
  return <Skeleton className="rounded-full h-8 w-8" />;
}

function UploadPostSkeleton() {
  return (
    <div className="bg-white px-4 py-4 rounded-t-lg flex items-center gap-[0.625rem]">
      <AvatarSkeleton />
      <Skeleton className="w-full h-8" />
    </div>
  );
}

export function PostSkeletonList({postCount = 5}: {postCount?: number}) {
  const showImageView = Math.floor(Math.random() * postCount);
  return (
    <div>
      {[...Array(postCount)].map((_, i) => (
        <PostSkeleton key={i} galleryPriview={i === showImageView} />
      ))}
    </div>
  );
}

function PostSkeleton({galleryPriview = false}: {galleryPriview?: boolean}) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-md mt-4">
      <div>
        <div className="flex gap-4 ">
          <AvatarSkeleton />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="w-full h-[1px] my-2" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="rounded-full h-10 w-10" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      {galleryPriview && (
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      <Skeleton className="w-full h-[1px] my-2" />
      <div className="flex items-center gap-[0.625rem]">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-32 h-8" />
      </div>
    </div>
  );
}
