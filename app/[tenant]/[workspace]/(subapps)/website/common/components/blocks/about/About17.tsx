import {FC} from 'react';
import ListColumn from '@/subapps/website/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList1} from '@/subapps/website/common/data/about';

const About17: FC = () => {
  return (
    <div className="row gx-3 gy-10 mb-15 mb-md-18 align-items-center">
      <div className="col-lg-5 offset-lg-1">
        <figure>
          <img
            className="w-auto"
            src="/img/illustrations/3d2.png"
            srcSet="/img/illustrations/3d2@2x.png 2x"
            alt=""
          />
        </figure>
      </div>

      <div className="col-lg-5 offset-lg-1">
        <h2 className="fs-16 text-uppercase text-gradient gradient-1 mb-3">
          Our Solution
        </h2>
        <h3 className="display-5 mb-4">
          We offer services to help control money in efficient way possible.
        </h3>
        <p className="mb-6">
          A community refers to a group of people who share common interests,
          beliefs, values, or goals and interact with one another in a shared
          location or virtual space. Goals and interact with one another in a
          shared location or virtual space.
        </p>

        <ListColumn list={aboutList1} />
      </div>
    </div>
  );
};

export default About17;
