import {FC} from 'react';
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';
import {ProcessList1} from '@/subapps/website/common/components/reuseable/process-list';
// -------- data -------- //
import {processList1} from '@/subapps/website/common/data/process';

const Process14: FC = () => {
  return (
    <section className="wrapper bg-light">
      <div className="container pb-14 pb-md-17">
        <div className="row gx-md-8 gx-xl-12 gy-10 align-items-center">
          <div className="col-lg-6 order-lg-2">
            {processList1.map(item => {
              return <ProcessList1 shadow {...item} key={item.no} />;
            })}
          </div>

          <div className="col-lg-6">
            <h2 className="fs-16 text-uppercase text-primary mb-3">
              Our Strategy
            </h2>
            <h3 className="display-3 mb-4">
              These 3 practical measure help us organize company projects.
            </h3>
            <p>
              Have you ever wondered how much faster your website could be? Find
              out now by checking your SEO score. A high SEO score means that
              your website is optimized for search engines, making it more
              likely to appear at the top of
            </p>

            <p className="mb-6">
              By improving your website&apos;s speed, you can provide a better
              user experience for your visitors, reduce bounce rates, and
              ultimately increase conversions.
            </p>

            <NextLink
              title="Learn More"
              href="#"
              className="btn btn-primary rounded-pill mb-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process14;
