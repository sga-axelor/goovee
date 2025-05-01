import {FC} from 'react';
// -------- data -------- //
import {processList6} from '@/subapps/templates/common/data/process';

const Process5: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-10 mb-lg-19 mb-xl-22 align-items-center">
      <div className="col-lg-6">
        <figure>
          <img
            alt="how it work"
            src="/img/photos/device.png"
            srcSet="/img/photos/device@2x.png 2x"
          />
        </figure>
      </div>

      <div className="col-lg-6">
        <h2 className="fs-15 text-uppercase text-muted mb-3">How It Works</h2>
        <h3 className="display-4 mb-5">
          Download the app, create your profile, and you're ready to go!
        </h3>
        <p className="mb-8">
          Individual health-related objectives may vary depending on factors
          such as age, gender, medical history, and personal preferences.
          Additionally, it's important to set realistic and achievable goals
          that are specific, measurable, and time-bound.
        </p>

        <div className="row gy-6 gx-xxl-8 process-wrapper">
          {processList6.map(({id, title, description, Icon, color}) => (
            <div className="col-md-4" key={id}>
              {<Icon />}
              <h4 className="mb-1">{title}</h4>
              <p className="mb-0">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process5;
