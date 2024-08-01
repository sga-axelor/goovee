'use client';
import {useRouter} from 'next/navigation';

// ---- LOCAL IMPORTS ---- //
import {NavMenu, SingleGroup} from '@/subapps/forum/common/ui/components';
import {MENU} from '@/subapps/forum/common/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

interface groupContentProps {
  groupId: string;
  userId: string;
  memberGroups: any;
  nonMemberGroups: any;
}

const Content = ({
  groupId,
  userId,
  memberGroups,
  nonMemberGroups,
}: groupContentProps) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleMenuClick = (link: string) => {
    router.push(`${workspaceURI}/forum/${link}`);
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="hidden lg:block">
        <NavMenu items={MENU} onClick={handleMenuClick} />
      </div>
      <SingleGroup
        groupId={groupId}
        userId={userId}
        memberGroups={memberGroups}
        nonMemberGroups={nonMemberGroups}
      />
    </div>
  );
};

export default Content;
