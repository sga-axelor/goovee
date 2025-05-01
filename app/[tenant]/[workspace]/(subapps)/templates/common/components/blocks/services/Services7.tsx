import {FC, Fragment} from 'react';
import {ServiceCard3} from '@/subapps/templates/common/components/reuseable/service-cards';
// -------- data -------- //
import {serviceList6} from '@/subapps/templates/common/data/service';

const Services7: FC = () => {
  return (
    <Fragment>
      <div className="row text-center">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <h2 className="fs-15 text-uppercase text-muted mb-3">App Features</h2>
          <h3 className="display-4 mb-9 ">
            By using Lighthouse, you can monitor all of your health-related
            objectives in a single application.
          </h3>
        </div>
      </div>

      <div className="row gx-lg-8 gx-xl-12 gy-8 mb-14 mb-md-17">
        {serviceList6.map(({Icon, color, ...item}) => (
          <div className="col-md-6 col-lg-4" key={item.id}>
            <ServiceCard3 {...item} Icon={<Icon />} />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Services7;
