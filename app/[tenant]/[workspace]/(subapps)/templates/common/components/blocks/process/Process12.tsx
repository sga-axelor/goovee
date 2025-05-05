import {FC} from 'react';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';
import {ServiceCard3} from '@/subapps/templates/common/components/reuseable/service-cards';
// -------- data -------- //
import {processList9} from '@/subapps/templates/common/data/process';

const Process12: FC = () => {
  return (
    <div className="row gx-md-8 gx-xl-12 gy-10 align-items-center">
      <div className="col-lg-6">
        <h2 className="fs-15 text-uppercase text-muted mb-3">Our Strategy</h2>
        <h3 className="display-4 mb-5">
          Three practical measure will help us our company projects.
        </h3>
        <p>
          Have you ever wondered how much faster your website could be? Find out
          now by checking your SEO score. A high SEO score means that your
          website is optimized for search engines, making it more likely to
          appear at the top of
        </p>

        <p className="mb-6">
          By improving your website&apos;s speed, you can provide a better user
          experience for your visitors, reduce bounce rates, and ultimately
          increase conversions.
        </p>

        <NextLink
          href="#"
          title="Learn More"
          className="btn btn-primary rounded-pill mb-0"
        />
      </div>

      <div className="col-lg-6">
        {processList9.map(({className, no, title, subtitle, color}) => (
          <ServiceCard3
            key={no}
            title={title}
            description={subtitle}
            className={'d-flex flex-row ' + className}
            Icon={
              <span
                className={`icon btn btn-block btn-lg btn-soft-${color} pe-none mt-1 me-5`}>
                <span className="number fs-22">{no}</span>
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Process12;
