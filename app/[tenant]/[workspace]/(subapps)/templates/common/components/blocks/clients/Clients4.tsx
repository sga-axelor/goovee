import {FC} from 'react';
import FigureImage from 'components/reuseable/FigureImage';
// -------- data -------- //
import {clientList2} from 'data/client';

const Clients4: FC = () => {
  return (
    <section className="wrapper bg-gray">
      <div className="container py-14 py-md-16">
        <div className="row gx-lg-8 gx-xl-12 gy-10 gy-lg-0 mb-10">
          <div className="col-lg-4 mt-lg-2">
            <h3 className="display-4 mb-3">
              300+ customers have given faith in us.
            </h3>
            <p className="lead fs-lg mb-0">
              We create ideas that make our clients' lives better.
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

export default Clients4;
