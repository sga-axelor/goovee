import {FC, Fragment} from 'react';
import {Tiles10} from '@/subapps/templates/common/components/elements/tiles';
import ListColumn from '@/subapps/templates/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList3, aboutList1} from '@/subapps/templates/common/data/about';

const About11: FC = () => {
  return (
    <Fragment>
      <div className="row gx-lg-8 gx-xl-12 gy-10 mb-10 mb-md-12 align-items-center">
        <div className="col-lg-6 order-lg-2">
          <Tiles10 />
        </div>

        <div className="col-lg-6">
          <h2 className="display-4 mb-3">Discover our company</h2>
          <p className="lead fs-lg">
            We are a creative advertising firm that focuses on the influence of
            great design and creative thinking.
          </p>
          <p className="mb-6">
            A community refers to a group of people who share common interests,
            beliefs, values, or goals and interact with one another in a shared
            location or virtual space. Communities can be found in various
            forms.
          </p>

          <ListColumn rowClass="gx-xl-8" list={aboutList1} />
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

export default About11;
