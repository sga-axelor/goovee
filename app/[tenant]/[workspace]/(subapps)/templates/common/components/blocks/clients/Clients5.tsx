import {FC} from 'react';
import FigureImage from '@/subapps/templates/common/components/reuseable/FigureImage';
// -------- data -------- //
import {clientList2} from '@/subapps/templates/common/data/client';

const Clients5: FC = () => {
  return (
    <section className="wrapper bg-light">
      <div className="container py-15 py-md-17">
        <div className="row gx-lg-8 gx-xl-12 gy-10 gy-lg-0">
          <div className="col-lg-4 mt-lg-2">
            <h2 className="fs-16 text-uppercase text-muted mb-3">
              Our Clients
            </h2>
            <h3 className="display-5 mb-3 pe-xxl-4">
              300+ customers have given faith in us.
            </h3>
            <p className="lead mb-0 pe-xxl-7">
              We create ideas that make our clients&apos; lives better.
            </p>
          </div>

          <div className="col-lg-8">
            <div className="row row-cols-2 row-cols-md-4 gx-0 gx-md-8 gx-xl-12 gy-12">
              {clientList2.map(item => (
                <div className="col" key={item}>
                  <FigureImage
                    width={450}
                    height={301}
                    src={item}
                    className="px-3 px-md-0 px-xxl-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients5;
