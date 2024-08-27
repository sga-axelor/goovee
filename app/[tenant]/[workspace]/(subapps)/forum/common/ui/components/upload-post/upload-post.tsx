'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Dialog, DialogContent, DialogTitle} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {MAKE_A_NEW_POST} from '@/subapps/forum/common/constants';
import {CreatePost} from '@/subapps/forum/common/ui/components';

interface uploadPostProps {
  open?: boolean;
  groups?: any[];
  onClose: () => void;
}
export const UploadPost = ({open, groups = [], onClose}: uploadPostProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`max-w-screen-lg h-fit p-1 xl:p-4`}>
          <DialogTitle className="hidden">
            {i18n.get(MAKE_A_NEW_POST)}
          </DialogTitle>
          <CreatePost groups={groups} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
