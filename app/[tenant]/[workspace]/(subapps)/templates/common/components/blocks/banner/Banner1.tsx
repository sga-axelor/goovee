import {FC} from 'react';
import GoogleAppBtn from 'components/common/GoogleAppBtn';

const Banner1: FC = () => {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-5 pb-15 pt-lg-10 pb-lg-2">
        <div className="row gx-lg-8 gx-xl-12 align-items-center">
          <div className="col-lg-6">
            <img
              alt=""
              src="/img/photos/devices2.png"
              srcSet="/img/photos/devices2@2x.png 2x"
              className="w-100"
            />
          </div>

          <div className="col-md-10 offset-md-1 offset-lg-0 col-lg-6 mt-md-n9 text-center text-lg-start">
            <h1 className="display-4 mb-4 px-md-10 px-lg-0">
              Put your physical activity, rest, & medicine routine into one
              place.
            </h1>

            <p className="lead fs-lg mb-7 px-md-10 px-lg-0 pe-xxl-15">
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

export default Banner1;
