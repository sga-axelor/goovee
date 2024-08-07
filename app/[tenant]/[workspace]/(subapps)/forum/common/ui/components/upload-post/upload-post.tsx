'use client';
import {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Dialog, DialogContent, DialogTitle} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {MAKE_A_NEW_POST} from '@/subapps/forum/common/constants';
import {
  CreatePost,
  FileUploader,
  ImageUploader,
} from '@/subapps/forum/common/ui/components';

interface uploadPostProps {
  initialType?: string;
  open?: boolean;
  groups: any[];
  onClose: () => void;
}
export const UploadPost = ({
  open,
  groups = [],
  onClose,
  initialType = '',
}: uploadPostProps) => {
  const [type, setType] = useState<string>(initialType);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);
  const handleDialogOpen = (type: string) => {
    setType(type);
  };
  const handleClose = () => {
    setType('');
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`max-w-screen-lg h-fit p-1 xl:p-4`}>
          <DialogTitle className="hidden">
            {i18n.get(MAKE_A_NEW_POST)}
          </DialogTitle>
          {type === '' && (
            <CreatePost
              groups={groups}
              handleDialogOpen={handleDialogOpen}
              onClose={onClose}
            />
          )}
          {type === 'image' && <ImageUploader handleClose={handleClose} />}
          {type === 'file' && <FileUploader handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};
