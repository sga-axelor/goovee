import {FC} from 'react';
import {clients} from '@/subapps/templates/common/data/demo-8';

const Clients2: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 gy-lg-0 mb-13 mb-md-17">
      <div className="col-lg-4 text-center text-lg-start">
        <h2 className="display-5 mb-3">
          Over 20,000 customers have trusted in us.
        </h2>
        <p className="lead fs-lg mb-0 pe-xxl-2">
          We provide ideas that make life for our customers easier.
        </p>
      </div>

      <div className="col-lg-8">
        <div className="row row-cols-2 row-cols-md-4 gx-0 gx-md-8 gx-xl-12 gy-11 mt-n10">
          {clients.map(({id, image}) => (
            <div className="col" key={id}>
              <figure className="px-4 px-lg-3 px-xxl-5">
                <img src={image} alt="brand" />
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients2;
