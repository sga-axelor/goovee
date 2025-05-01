import {FC} from 'react';
import {Tiles3} from 'components/elements/tiles';
import NextLink from 'components/reuseable/links/NextLink';

const Contact8: FC = () => {
  return (
    <div className="row gy-10 gx-lg-8 gx-xl-12 align-items-center">
      <div className="col-lg-7 position-relative">
        <Tiles3 />
      </div>

      <div className="col-lg-5">
        <h2 className="display-4 mb-3">Get in Touch</h2>
        <p className="lead fs-lg">
          Grow your business with our proven track record of success and join
          our community of our 5K+ satisfied clients and partner.
        </p>

        <p>
          Our portfolio is filled with a diverse range of works that highlight
          our creativity and innovation. We take great pride in our ability to
          develop custom solutions that exceed our clients' expectations and
          push the boundaries of design.
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

export default Contact8;
