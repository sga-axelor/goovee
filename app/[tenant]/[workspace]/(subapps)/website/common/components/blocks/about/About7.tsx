import {FC} from 'react';
import AccordionList from '@/subapps/website/common/components/common/AccordionList';

const About7: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-15 mb-md-18 align-items-center">
      <div className="col-lg-7 order-lg-2">
        <figure>
          <img
            className="w-auto"
            src="/img/illustrations/i17.png"
            srcSet="/img/illustrations/i17@2x.png 2x"
            alt=""
          />
        </figure>
      </div>

      <div className="col-lg-5">
        <h3 className="display-4 mt-xxl-8 mb-3">
          Discover the Benefits of Choosing Us
        </h3>
        <p className="lead fs-lg lh-sm mb-6">
          We are committed to building lasting connections with our clients.
        </p>

        <AccordionList />
      </div>
    </div>
  );
};

export default About7;
