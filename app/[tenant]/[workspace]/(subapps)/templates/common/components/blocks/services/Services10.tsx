import {FC} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {ServiceCard5} from 'components/reuseable/service-cards';

const Services10: FC = () => {
  return (
    <div className="row gx-lg-0 gy-10 mb-15 mb-md-18 align-items-center">
      <div className="col-lg-6">
        <div className="row g-6 text-center">
          <div className="col-md-6">
            <div className="row">
              <div className="col-lg-12">
                <figure className="rounded mb-6">
                  <img
                    src="/img/photos/se2.jpg"
                    srcSet="/img/photos/se2@2x.jpg 2x"
                    alt=""
                  />
                </figure>
              </div>

              <div className="col-lg-12">
                <ServiceCard5
                  url="#"
                  title="Artificial Intelligence"
                  icon="uil-circuit"
                  className="card shadow-lg mb-md-6 mt-lg-6"
                  description="IoT development, devices are connected to the internet and automate processes."
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-lg-12 order-md-2">
                <figure className="rounded mb-6 mb-md-0">
                  <img
                    src="/img/photos/se1.jpg"
                    srcSet="/img/photos/se1@2x.jpg 2x"
                    alt=""
                  />
                </figure>
              </div>

              <div className="col-lg-12">
                <ServiceCard5
                  url="#"
                  icon="uil-desktop"
                  title="IoT Development"
                  description="IoT development, devices are connected to the internet and automate processes."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5 offset-lg-1">
        <h2 className="display-4 mb-3">What We Provide?</h2>

        <p className="lead fs-lg lh-sm">
          The comprehensive service we provide is specially tailored to your
          company's requirements.
        </p>

        <p>
          Agency services refer to a type of business model where companies or
          individuals outsource certain functions or tasks to an external
          agency. These agencies specialize in providing a range of services
          such as marketing, advertising, public relations, and creative
          services.
        </p>

        <NextLink
          title="More Details"
          href="#"
          className="btn btn-primary rounded-pill mt-3"
        />
      </div>
    </div>
  );
};

export default Services10;
