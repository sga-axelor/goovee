import {FC} from 'react';
// -------- custom component -------- //
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';
import {ServiceCard4} from '@/subapps/templates/common/components/reuseable/service-cards';
// -------- data -------- //
import {serviceList7} from '@/subapps/templates/common/data/service';

const Services9: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-lg-22 mb-xl-24 align-items-center">
      <div className="col-lg-7 order-lg-2">
        <div className="row gx-md-5 gy-5">
          {serviceList7.map(({id, Icon, color, ...item}) => (
            <ServiceCard4
              key={id}
              Icon={<Icon className={`solid icon-svg-md text-${color} mb-3`} />}
              {...item}
            />
          ))}
        </div>
      </div>

      <div className="col-lg-5">
        <h2 className="fs-15 text-uppercase text-muted mb-3">
          What We Provide?
        </h2>
        <h3 className="display-4 mb-5">
          Our service is customized to your individual requirements.
        </h3>
        <p>
          A community refers to a group of people who share common interests,
          beliefs, values, or goals and interact with one another in a shared
          location or virtual space. Goals and interact with one another in a
          shared location or virtual space.
        </p>
        <NextLink
          title="More Details"
          href="#"
          className="btn btn-navy rounded-pill mt-3"
        />
      </div>
    </div>
  );
};

export default Services9;
