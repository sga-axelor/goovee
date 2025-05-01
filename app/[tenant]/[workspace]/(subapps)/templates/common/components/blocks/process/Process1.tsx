import {FC} from 'react';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';
import {ProcessList1} from '@/subapps/templates/common/components/reuseable/process-list';
// -------- data -------- //
import {processList1} from '@/subapps/templates/common/data/process';

const Process1: FC = () => {
  return (
    <div className="row gx-md-8 gx-xl-12 gy-10 mb-14 mb-md-18 align-items-center">
      <div className="col-lg-6 order-lg-2">
        {processList1.map(item => (
          <ProcessList1 shadow {...item} key={item.no} />
        ))}
      </div>

      <div className="col-lg-6">
        <h2 className="fs-16 text-uppercase text-muted mb-3">Our Strategy</h2>
        <h3 className="display-5 mb-5">
          These 3 practical measure will help us organize our company projects.
        </h3>

        <p>
          Have you ever wondered how much faster your website could be? Find out
          now by checking your SEO score. A high SEO score means that your
          website is optimized for search engines, making it more likely to
          appear at the top of
        </p>

        <p className="mb-6">
          By improving your website's speed, you can provide a better user
          experience for your visitors, reduce bounce rates, and ultimately
          increase conversions.
        </p>

        <NextLink
          href="#"
          title="Learn More"
          className="btn btn-primary rounded-pill mb-0"
        />
      </div>
    </div>
  );
};

export default Process1;
