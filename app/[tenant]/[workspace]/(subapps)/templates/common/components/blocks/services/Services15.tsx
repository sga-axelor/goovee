import {FC} from 'react';
import ListColumn from 'components/reuseable/ListColumn';
// -------- data -------- //
import {list} from 'data/demo-11';

const Services15: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center mb-md-15">
      <div className="col-lg-7 order-lg-2">
        <figure>
          <img
            className="w-auto"
            src="/img/illustrations/i9.png"
            srcSet="/img/illustrations/i9@2x.png 2x"
            alt=""
          />
        </figure>
      </div>

      <div className="col-lg-5">
        <h2 className="fs-15 text-uppercase text-primary mb-3">
          Our Solutions
        </h2>
        <h3 className="display-4 mb-5">
          We offer services to help control money in efficient way possible.
        </h3>
        <p className="mb-6">
          A community refers to a group of people who share common interests,
          beliefs, values, or goals and interact with one another in a shared
          location or virtual space.
        </p>

        <ListColumn list={list} />
      </div>
    </div>
  );
};

export default Services15;
