import {FC} from 'react';
import ListColumn from '@/subapps/templates/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList2} from '@/subapps/templates/common/data/about';

const Team7: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-14 mb-md-17 align-items-center">
      <div className="col-md-8 col-lg-6 order-lg-2">
        <figure className="rounded">
          <img
            src="/img/photos/about24.jpg"
            srcSet="/img/photos/about24@2x.jpg 2x"
            alt=""
          />
        </figure>
      </div>

      <div className="col-lg-6">
        <h2 className="fs-15 text-uppercase text-muted mb-3">Our Team</h2>
        <h3 className="display-3 mb-5">
          Choose our team of experts to save time.
        </h3>
        <p className="mb-6">
          A community refers to a group of people who share common interests,
          beliefs, values, or goals and interact with one another in a shared
          location or virtual space. Communities can be found in various forms.
        </p>

        <ListColumn list={aboutList2} rowClass="gx-xl-8" />
      </div>
    </div>
  );
};

export default Team7;
