import {FC} from 'react';
import {Tiles5} from 'components/elements/tiles';
import ListColumn from 'components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList2} from 'data/about';

const About6: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-14 mb-md-17 align-items-center">
      <div className="col-lg-6 position-relative order-lg-2">
        <Tiles5 />
      </div>

      <div className="col-lg-6">
        <h2 className="display-4 mb-3">Why Choose Us?</h2>

        <p className="lead fs-lg">
          We are a creative advertising firm that focuses on the influence of
          great design and creative thinking.
        </p>

        <p className="mb-6">
          Customers may choose your company because you provide excellent
          customer service that makes them feel valued and appreciated. This can
          include fast response times, personalized attention. Customers may
          choose your company because you provide excellent customer service.
        </p>

        <ListColumn rowClass="gx-xl-8" list={aboutList2} />
      </div>
    </div>
  );
};

export default About6;
