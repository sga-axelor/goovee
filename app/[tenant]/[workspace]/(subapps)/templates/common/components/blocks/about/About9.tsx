import {FC} from 'react';
import {ServiceCard3} from 'components/reuseable/service-cards';
// -------- data -------- //
import {whatWeAre} from 'data/demo-8';

const About9: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-14 mb-md-18 align-items-center">
      <div className="col-md-8 col-lg-6 position-relative">
        <div
          className="shape bg-soft-primary rounded-circle rellax w-20 h-20"
          style={{top: '-2rem', left: '-1.9rem'}}
        />

        <figure className="rounded">
          <img
            src="/img/photos/about10.jpg"
            srcSet="/img/photos/about10@2x.jpg 2x"
            alt=""
          />
        </figure>
      </div>

      <div className="col-lg-6">
        <h2 className="display-4 mb-3">Discover Our Company</h2>
        <p className="lead fs-lg">
          We are a creative advertising firm that focuses on the influence of
          great design and creative thinking.
        </p>
        <p className="mb-6">
          A community refers to a group of people who share common interests,
          beliefs, values, or goals and interact with one another in a shared
          location or virtual space. Communities can be found in various forms.
        </p>

        <div className="row gx-xl-10 gy-6">
          {whatWeAre.map(({id, title, description, Icon}) => (
            <div className="col-md-6" key={id}>
              <ServiceCard3
                title={title}
                description={description}
                Icon={<Icon className="solid icon-svg-sm text-aqua me-4" />}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About9;
