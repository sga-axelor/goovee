import {FC} from 'react';
import {slideInDownAnimate} from '@/subapps/templates/common/utils/animation';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';

const Hero4: FC = () => {
  return (
    <section className="wrapper bg-light position-relative min-vh-70 d-lg-flex align-items-center">
      <div
        style={{backgroundImage: 'url(/img/photos/about16.jpg)'}}
        className="rounded-4-lg-start col-lg-6 order-lg-2 position-lg-absolute top-0 end-0 image-wrapper bg-image bg-cover h-100 min-vh-50"
      />

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="mt-10 mt-md-11 mt-lg-n10 px-10 px-md-11 ps-lg-0 pe-lg-13 text-center text-lg-start">
              <h1
                className="display-2 mb-5"
                style={slideInDownAnimate('600ms')}>
                Simple get down & calm down and we&apos;re control your
                requirements.
              </h1>
              <p
                className="lead fs-23 lh-sm mb-7 pe-md-10"
                style={slideInDownAnimate('900ms')}>
                Simplify your spending and take full control of your finances
                without any stress.
              </p>

              <div
                className="d-flex justify-content-center justify-content-lg-start"
                style={slideInDownAnimate('900ms')}>
                <span style={slideInDownAnimate('1200ms')}>
                  <NextLink
                    href="#"
                    title="Explore Now"
                    className="btn btn-lg btn-primary rounded-pill me-2"
                  />
                </span>

                <span style={slideInDownAnimate('1500ms')}>
                  <NextLink
                    href="#"
                    title="Contact Us"
                    className="btn btn-lg btn-outline-primary rounded-pill"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero4;
