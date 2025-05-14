import {FC} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Carousel from '@/subapps/website/common/components/reuseable/Carousel';
// -------- data -------- //
import {portfolioList3} from '@/subapps/website/common/data/portfolio';

const Portfolio4: FC = () => {
  return (
    <section className="wrapper bg-light">
      <div className="overflow-hidden">
        <div className="container py-14 py-md-16">
          <div className="row">
            <div className="col-lg-9 col-xl-8 col-xxl-7 mx-auto text-center">
              <i className="icn-flower text-leaf fs-30 opacity-25"></i>
              <h2 className="display-5 text-center mt-2 mb-10">
                A few of the most touching stories I experienced and got the
                opportunity to photograph
              </h2>
            </div>
          </div>

          <div className="swiper-container grid-view nav-bottom nav-color mb-14 text-center">
            <Carousel
              pagination={false}
              className="overflow-visible pb-2"
              breakpoints={{0: {slidesPerView: 1}, 768: {slidesPerView: 2}}}>
              {portfolioList3.map(item => (
                <div className="card shadow-lg" key={item.id}>
                  <figure className="card-img-top overlay overlay-1">
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={item.image['1x']}
                        srcSet={item.image['2x']}
                        alt=""
                      />
                      <span className="bg" />
                    </Link>

                    <figcaption>
                      <h5 className="from-top mb-0">View Gallery</h5>
                    </figcaption>
                  </figure>

                  <div className="card-body p-6">
                    <h3 className="fs-21 mb-1">{item.name}</h3>
                    <ul className="post-meta fs-16 mb-0">
                      <li>{item.photos} Photos</li>
                      <li>{item.category}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio4;
