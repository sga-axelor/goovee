import {FC, Fragment} from 'react';
import {TeamCard3} from '@/subapps/website/common/components/reuseable/team-cards';
// -------- data -------- //
import {teams} from '@/subapps/website/common/data/demo-11';

const Team6: FC = () => {
  return (
    <Fragment>
      <div className="row mb-3">
        <div className="col-md-10 col-lg-12 col-xl-10 col-xxl-9 mx-auto text-center">
          <h2 className="fs-15 text-uppercase text-primary mb-3">Our Team</h2>
          <h3 className="display-4 mb-7 px-lg-13">
            Look beyond the box and get creative. Lighthouse can help you create
            an influence.
          </h3>
        </div>
      </div>

      <div className="row grid-view gx-md-8 gx-xl-10 gy-8 gy-lg-0 mb-md-20">
        {teams.map(item => (
          <div className="col-md-6 col-lg-3" key={item.id}>
            <TeamCard3 {...item} />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Team6;
