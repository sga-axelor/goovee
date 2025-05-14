import {FC} from 'react';
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';

const CTA4: FC = () => {
  return (
    <section
      className="wrapper image-wrapper bg-image bg-overlay"
      style={{backgroundImage: 'url(/img/photos/bg9.jpg)'}}>
      <div className="container py-18">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="fs-16 text-uppercase text-white mb-3 text-line">
              Join Our Community
            </h2>
            <h3 className="display-4 mb-5 mb-6 text-white pe-xxl-24">
              Trust us, join 10K+ clients to grow your business.
            </h3>

            <NextLink
              href="#"
              title="Join Us"
              className="btn btn-white rounded mb-0 text-nowrap"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA4;
