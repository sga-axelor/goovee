import {FC} from 'react';
import Typewriter from 'typewriter-effect';
import {
  slideInDownAnimate,
  zoomInAnimate,
} from '@/subapps/website/common/utils/animation';
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';

const Hero9: FC = () => {
  // typewriter options
  const OPTIONS = {
    loop: true,
    autoStart: true,
    strings: ['quick transactions.', 'easy usage', 'secure payments'],
  };

  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-10 pb-14 pb-lg-0">
        <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
          <div className="col-md-10 offset-md-1 offset-lg-0 col-lg-5 mt-lg-n2 text-center text-lg-start order-2 order-lg-0">
            <h1
              className="display-1 mb-5 mx-md-10 mx-lg-0"
              style={slideInDownAnimate('600ms')}>
              Lighthouse is simple and strong, with <br />
              <span className="typer text-primary text-nowrap">
                <Typewriter options={OPTIONS} />
              </span>
            </h1>

            <p className="lead fs-lg mb-7" style={slideInDownAnimate('900ms')}>
              Meet your savings targets. Keep track of all of your recurrent &
              single-time expenses and revenue in one location.
            </p>

            <div className="d-flex justify-content-center justify-content-lg-start">
              <span style={slideInDownAnimate('1200ms')}>
                <NextLink
                  title="Get Started"
                  href="#"
                  className="btn btn-lg btn-primary rounded me-2"
                />
              </span>

              <span style={slideInDownAnimate('1500ms')}>
                <NextLink
                  title="Free Trial"
                  href="#"
                  className="btn btn-lg btn-green rounded"
                />
              </span>
            </div>
          </div>

          <div className="col-lg-7">
            <img
              className="w-100 img-fluid"
              src="/img/photos/sa16.png"
              srcSet="/img/photos/sa16@2x.png 2x"
              alt="demo"
              style={zoomInAnimate('0ms')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero9;
