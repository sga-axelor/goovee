import {getDownloadURL} from '@/subapps/resources/common/utils';

export default function ImageViewer({record}: any) {
  return (
    <div className="container">
      <img
        className="object-cover max-w-100"
        src={getDownloadURL(record)}></img>
    </div>
  );
}
