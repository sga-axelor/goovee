import {FC, Fragment} from 'react';
import {ServiceCard2} from '@/subapps/templates/common/components/reuseable/service-cards';
// -------- data -------- //
import {serviceList2} from '@/subapps/templates/common/data/service';

const Services4: FC = () => {
  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-8 col-xl-7 col-xxl-6">
          <h2 className="fs-16 text-uppercase text-line text-primary mb-3">
            What We Do?
          </h2>
          <h3 className="display-4 mb-9">
            We took pleasure in offering unique solutions to your particular
            needs.
          </h3>
        </div>
      </div>

      <div className="row gx-md-8 gy-8 mb-14 mb-md-18">
        {serviceList2.map(item => (
          <ServiceCard2
            {...item}
            key={item.id}
            iconBoxClassNames="icon btn btn-block btn-lg btn-soft-primary pe-none mb-6"
          />
        ))}
      </div>
    </Fragment>
  );
};

export default Services4;
