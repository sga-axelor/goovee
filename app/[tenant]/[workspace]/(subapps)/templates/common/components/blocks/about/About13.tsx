import {FC} from 'react';
import {Banner4} from '../banner';
import ListColumn from 'components/reuseable/ListColumn';
// -------- custom hooks -------- //
import useLightBox from 'hooks/useLightBox';
// -------- data -------- //
import {aboutList1} from 'data/about';

const About13: FC = () => {
  // lighbox hook called
  useLightBox();

  return (
    <div className="row gy-10 gy-sm-13 gx-lg-3 align-items-center mb-14 mb-md-18">
      <div className="col-md-8 col-lg-6 position-relative">
        <Banner4 />
      </div>

      <div className="col-lg-5 offset-lg-1">
        <h2 className="fs-15 text-uppercase text-primary mb-3">Who Are We?</h2>
        <h3 className="display-5 mb-6">
          The organization that thinks about the efficacy of strategies.
        </h3>
        <p className="mb-6">
          Customers may choose your company because you provide excellent
          customer service that makes them feel valued and appreciated. This can
          include fast response times, personalized attention.
        </p>

        <ListColumn list={aboutList1} rowClass="gx-xl-8" />
      </div>
    </div>
  );
};

export default About13;
