'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Dialog, DialogContent, DialogTitle} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {MAKE_A_NEW_POST} from '@/subapps/forum/common/constants';
import {CreatePost} from '@/subapps/forum/common/ui/components';
import {ForumGroup} from '@/subapps/forum/common/types/forum';

interface uploadPostProps {
  open?: boolean;
  groups?: any[];
  selectedGroup?: ForumGroup | null;
  onClose: () => void;
}
export const UploadPost = ({
  open,
  groups = [],
  selectedGroup = null,
  onClose,
}: uploadPostProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`max-w-screen-lg h-fit p-1 xl:p-4`}>
          <DialogTitle className="hidden">
            {i18n.get(MAKE_A_NEW_POST)}
          </DialogTitle>
          <CreatePost
            groups={groups}
            selectedGroup={selectedGroup}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
