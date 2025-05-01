import {FC, Fragment} from 'react';
import {Tiles11} from '@/subapps/templates/common/components/elements/tiles';
import ListColumn from '@/subapps/templates/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList2, aboutList3} from '@/subapps/templates/common/data/about';

const About19: FC = () => {
  return (
    <Fragment>
      <div className="row gy-10 gy-sm-13 gx-md-8 gx-xl-12 align-items-center mb-10 mb-md-12">
        <div className="col-lg-6">
          <Tiles11 />
        </div>

        <div className="col-lg-6">
          <h2 className="fs-16 text-uppercase text-gradient gradient-1 mb-3">
            Who Are We?
          </h2>
          <h3 className="display-4 mb-4">
            We are a creative advertising firm that influence of great design.
          </h3>
          <p className="mb-6">
            A community refers to a group of people who share common interests,
            beliefs, values, or goals and interact with one another in a shared
            location or virtual space. Communities can be found in various
            forms. A community refers to a group of people who share common
            interests.
          </p>

          <ListColumn rowClass="gx-xl-8" list={aboutList2} />
        </div>
      </div>

      <div className="row gx-lg-8 gx-xl-12 gy-6 mb-14 mb-md-18">
        {aboutList3.map(({id, title, description}) => (
          <div className="col-lg-4" key={id}>
            <div className="d-flex flex-row">
              <div>
                <div className="icon btn btn-circle pe-none btn-soft-primary me-4">
                  <span className="number fs-18">{id}</span>
                </div>
              </div>

              <div>
                <h4>{title}</h4>
                <p className="mb-2">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default About19;
