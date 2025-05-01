import {FC} from 'react';
import Link from 'next/link';
import Image from 'next/image';
// -------- data -------- //
import {portfolioList5} from '@/subapps/templates/common/data/portfolio';

const Portfolio8: FC = () => {
  return (
    <section className="wrapper bg-light">
      <div className="container py-14 py-md-17">
        <div className="row mb-8 text-center">
          <div className="col-lg-10 col-xl-9 col-xxl-8 mx-auto">
            <h2 className="fs-16 text-uppercase text-primary mb-3">
              Our Projects
            </h2>
            <h3 className="display-4">
              Look out for a few of our fantastic works with outstanding designs
              and innovative concepts.
            </h3>
          </div>
        </div>

        <div className="grid grid-view projects-masonry">
          <div className="row gx-md-8 gy-10 gy-md-13 isotope">
            {portfolioList5.map(({id, image, title, category, color}) => (
              <div className="project item col-md-6 col-xl-4 product" key={id}>
                <figure className="lift rounded mb-6">
                  <Link href="#">
                    <Image
                      src={image}
                      alt={title}
                      width={1300}
                      height={1132}
                      style={{width: '100%', height: 'auto'}}
                    />
                  </Link>
                </figure>

                <div className="project-details d-flex justify-content-center flex-column">
                  <div className="post-header">
                    <div className={`post-category mb-2 text-${color}`}>
                      {category}
                    </div>
                    <h2 className="post-title h3">{title}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio8;
