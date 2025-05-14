import {FC, Fragment} from 'react';
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';
import {ProcessList1} from '@/subapps/website/common/components/reuseable/process-list';
// -------- data -------- //
import {processList1} from '@/subapps/website/common/data/process';

const Process7: FC = () => {
  return (
    <Fragment>
      <div className="row mb-5">
        <div className="col-md-10 col-xl-8 col-xxl-7 mx-auto text-center">
          <h2 className="display-4 mb-4">
            These 3 practical measure will help us organize our company
            projects.
          </h2>
        </div>
      </div>

      <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
        <div className="col-lg-6 order-lg-2">
          {processList1.map(item => (
            <ProcessList1 shadow {...item} key={item.no} />
          ))}
        </div>

        <div className="col-lg-6">
          <h2 className="display-6 mb-3">How It Works?</h2>
          <p className="lead fs-lg pe-lg-5">
            We are a creative advertising firm that focuses on the influence of
            great design and creative thinking.
          </p>

          <p>
            Have you ever wondered how much faster your website could be? Find
            out now by checking your SEO score. A high SEO score means that your
            website is optimized for search engines, making it more likely to
            appear at the top of
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
    </Fragment>
  );
};

export default Process7;
