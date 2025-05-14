import {FC} from 'react';
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';

const Contact4: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-10 mb-md-14 align-items-center">
      <div className="col-lg-6">
        <figure>
          <img
            alt="contact"
            className="w-auto"
            src="/img/illustrations/i5.png"
            srcSet="/img/illustrations/i5@2x.png 2x"
          />
        </figure>
      </div>

      <div className="col-lg-6">
        <h2 className="fs-16 text-uppercase text-muted mb-3 ">Let’s Talk</h2>
        <h3 className="display-4 mb-5 ">
          Together, let&apos;s build something fantastic. We have more than 5000
          clients who trust us.
        </h3>

        <p>
          At our company, we understand that managing spending can be stressful
          and overwhelming, which is why we offer a range of services aimed at
          making it effortless for you to stay in control.
        </p>

        <NextLink
          title="Join Us"
          href="#"
          className="btn btn-primary rounded-pill mt-2"
        />
      </div>
    </div>
  );
};

export default Contact4;
