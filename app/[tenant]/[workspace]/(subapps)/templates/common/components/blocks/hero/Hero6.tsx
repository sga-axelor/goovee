import {FC} from 'react';
import {fadeInAnimate, slideInDownAnimate} from 'utils/animation';
import GoogleAppBtn from 'components/common/GoogleAppBtn';

const Hero6: FC = () => {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container py-10 ">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 offset-md-3 offset-lg-0">
            <img
              alt="hero"
              src="/img/photos/devices.png"
              srcSet="/img/photos/devices@2x.png 2x"
              style={{...fadeInAnimate('0ms')}}
              className="img-fluid"
            />
          </div>

          <div className="col-lg-5 text-center text-lg-start mt-md-10 mt-lg-0">
            <h1
              className="display-3 mb-4 mx-sm-n2 mx-md-0"
              style={slideInDownAnimate('600ms')}>
              Put your physical activity, rest, and medicine routine into one
              place.
            </h1>

            <p
              className="lead fs-lg mb-7 px-md-10 px-lg-0"
              style={slideInDownAnimate('900ms')}>
              Lighthouse is currently accessible to download from the App Store
              as well as the Google Play Store.
            </p>

            <GoogleAppBtn />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero6;
