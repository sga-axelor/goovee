import {i18n} from '@/lib/i18n';
import {Alert, AlertDescription, AlertTitle, Button} from '@/ui/components';
import {X} from 'lucide-react';
import {ReactNode, useCallback, useState} from 'react';
import {MdAdd} from 'react-icons/md';

export function HeaderWithAlert({
  title,
  alertTitle,
  renderer,
}: {
  title: ReactNode;
  alertTitle: ReactNode;
  renderer: ({closeAlert}: {closeAlert: () => void}) => ReactNode;
}) {
  const [showAlert, setShowAlert] = useState(false);

  const closeAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const openAlert = useCallback(() => {
    setShowAlert(true);
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h4 className="text-xl font-semibold">{title}</h4>
        {!showAlert && (
          <Button size="sm" type="button" variant="success" onClick={openAlert}>
            <MdAdd className="size-6 lg:me-1" />
            <span className="hidden lg:inline">{i18n.get('Add')}</span>
          </Button>
        )}
      </div>
      {showAlert && (
        <Alert variant="warning" className="group">
          <button
            className="ring-0 absolute right-2 top-2 rounded-md cursor-pointer p-1 text-foreground/50 lg:opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
            onClick={() => setShowAlert(false)}>
            <X className="h-4 w-4" />
          </button>
          <AlertTitle>{alertTitle}</AlertTitle>
          <AlertDescription>{renderer({closeAlert})}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
