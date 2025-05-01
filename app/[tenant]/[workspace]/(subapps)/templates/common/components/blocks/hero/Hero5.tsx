import {FC} from 'react';
import {slideInDownAnimate} from '@/subapps/templates/common/utils/animation';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';

const Hero5: FC = () => {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-10 pb-15 pt-md-14 pb-md-20 text-center">
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-8 col-xxl-7 mx-auto mb-13">
            <h1 className="display-1 mb-4" style={slideInDownAnimate('0ms')}>
              Keeping track of your expenses is now even simpler.
            </h1>

            <p
              className="lead fs-lg px-xl-12 px-xxl-4 mb-7"
              style={slideInDownAnimate('300ms')}>
              You'll have no issue achieving your financial targets. Keep care
              of all of your recurring and one-time spending and earnings in one
              location.
            </p>

            <div
              className="d-flex justify-content-center"
              style={slideInDownAnimate('600ms')}>
              <span style={slideInDownAnimate('900ms')}>
                <NextLink
                  href="#"
                  title="Get Started"
                  className="btn btn-primary rounded mx-1"
                />
              </span>

              <span style={slideInDownAnimate('1200ms')}>
                <NextLink
                  href="#"
                  title="Free Trial"
                  className="btn btn-green rounded mx-1"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero5;
