import {FC} from 'react';
// -------- custom component -------- //
import {Banner4} from '../banner';
import {ServiceCard3} from '@/subapps/website/common/components/reuseable/service-cards';
// -------- custom hooks -------- //
import useLightBox from '@/subapps/website/common/hooks/useLightBox';
// -------- data -------- //
import {processList8} from '@/subapps/website/common/data/process';

const Process9: FC = () => {
  // lighbox hook called
  useLightBox();

  return (
    <div className="row gy-10 gy-sm-13 gx-lg-3 align-items-center mb-14 mb-md-19">
      <div className="col-md-8 col-lg-6 position-relative">
        <Banner4 imageName="about8" />
      </div>

      <div className="col-lg-5 col-xl-4 offset-lg-1">
        <h2 className="fs-15 text-uppercase text-muted mb-3">How It Works?</h2>
        <h3 className="display-4">Our Working Process</h3>
        <p className="mb-8">
          Find out why our happy customers choose us by following these steps
        </p>

        {processList8.map(({Icon, id, iconColor, ...item}) => (
          <ServiceCard3
            key={id}
            {...item}
            Icon={<Icon className="solid icon-svg-sm text-primary me-5" />}
          />
        ))}
      </div>
    </div>
  );
};

export default Process9;
