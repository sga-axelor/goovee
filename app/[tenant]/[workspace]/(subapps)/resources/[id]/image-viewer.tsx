// ---- CORE IMPORTS ---- //
import {getDownloadURL} from '@/utils/image';

export default function ImageViewer({record}: any) {
  return (
    <div className="container">
      <img
        className="object-cover max-w-100"
        src={getDownloadURL({id: record})}></img>
    </div>
  );
}
