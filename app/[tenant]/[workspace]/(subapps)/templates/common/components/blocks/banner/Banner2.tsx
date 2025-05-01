import {FC} from 'react';

const Banner2: FC = () => {
  return (
    <div
      className="wrapper mobile image-wrapper bg-image bg-overlay text-white"
      style={{backgroundImage: 'url(/img/photos/bg34.jpg)'}}>
      <div className="container py-16 py-md-19 text-center">
        <h2 className="display-1 text-white mb-0">
          I shoot with imagination,
          <br className="d-none d-md-block" />
          philosophy, and emotion.
        </h2>
      </div>
    </div>
  );
};

export default Banner2;
