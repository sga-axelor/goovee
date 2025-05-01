import {FC} from 'react';
import {Banner4} from '../banner';
import ListColumn from '@/subapps/templates/common/components/reuseable/ListColumn';
// -------- custom hook -------- //
import useLightBox from '@/subapps/templates/common/hooks/useLightBox';
// -------- data -------- //
import {aboutList5} from '@/subapps/templates/common/data/about';

const About2: FC = () => {
  // used for video light box
  useLightBox();

  return (
    <div className="row gy-10 gy-sm-13 gx-lg-3 align-items-center mb-14 mb-md-17 mb-lg-19">
      <div className="col-md-8 col-lg-6 position-relative">
        <Banner4 />
      </div>

      <div className="col-lg-5 offset-lg-1">
        <h2 className="fs-15 text-uppercase text-muted mb-3">Who Are We?</h2>
        <h3 className="display-4 mb-6">
          We value the creativity of techniques in our company.
        </h3>

        <p className="mb-6">
          We take great pride in our ability to develop custom solutions that
          exceed our clients' expectations and push the boundaries of design. If
          you are looking for inspiration or want to see what is possible
        </p>

        <ListColumn rowClass="gx-xl-8" list={aboutList5} />
      </div>
    </div>
  );
};

export default About2;
