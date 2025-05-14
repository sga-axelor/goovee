import {FC} from 'react';
import {Tiles4} from '@/subapps/website/common/components/elements/tiles';
import IconBox from '@/subapps/website/common/components/reuseable/IconBox';
import {ServiceCard3} from '@/subapps/website/common/components/reuseable/service-cards';
// -------- data -------- //
import {serviceList2} from '@/subapps/website/common/data/service';

const Services8: FC = () => {
  return (
    <div className="row gx-lg-8 gy-8 mt-5 mt-md-12 mt-lg-0 mb-15 align-items-center">
      <div className="col-lg-6 order-lg-2">
        <Tiles4 />
      </div>

      <div className="col-lg-6">
        <h2 className="display-4 mb-3">What We Provide?</h2>
        <p className="lead fs-lg mb-8 pe-xxl-2">
          We took pleasure in offering unique solutions to your particular
          needs.
        </p>

        <div className="row gx-xl-10 gy-6">
          {serviceList2.map(({title, id, icon}) => (
            <div className="col-md-6 col-lg-12 col-xl-6" key={id}>
              <ServiceCard3
                title={title}
                description="Nulla vitae elit libero pharetra augue dapibus."
                Icon={
                  <IconBox
                    icon={icon}
                    className="icon btn btn-circle btn-lg btn-soft-primary pe-none me-5"
                  />
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services8;
