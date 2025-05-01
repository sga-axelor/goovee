import {FC} from 'react';
import ListColumn from '@/subapps/templates/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList1} from '@/subapps/templates/common/data/about';

const About8: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-15 mb-md-18 align-items-center">
      <div className="col-lg-7">
        <figure>
          <img
            className="w-auto"
            src="/img/illustrations/i9.png"
            srcSet="/img/illustrations/i9@2x.png 2x"
            alt=""
          />
        </figure>
      </div>

      <div className="col-lg-5">
        <h3 className="display-4 mb-3">Mastery of Control</h3>
        <p className="lead fs-lg lh-sm">
          We are committed to building lasting connections with our clients.
        </p>
        <p className="mb-6">
          A community refers to a group of people who share common interests,
          beliefs, values, or goals and interact with one another in a shared
          location or virtual space. Communities can be found in various forms.
        </p>

        <ListColumn list={aboutList1} />
      </div>
    </div>
  );
};

export default About8;
