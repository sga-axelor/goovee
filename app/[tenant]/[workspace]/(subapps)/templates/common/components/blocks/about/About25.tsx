import {FC} from 'react';
import Image from 'next/image';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';
import {ServiceCard3} from '@/subapps/templates/common/components/reuseable/service-cards';
// -------- data -------- //
import {processList12} from '@/subapps/templates/common/data/process';

const About25: FC = () => {
  return (
    <section id="about">
      <div className="wrapper bg-gray">
        <div className="container py-14 py-md-16">
          <div className="row gx-md-8 gx-xl-12 gy-6 align-items-center">
            <div className="col-md-8 col-lg-6 order-lg-2 mx-auto">
              <div className="img-mask mask-2">
                <Image
                  width={1000}
                  height={850}
                  src="/img/photos/about30.jpg"
                  alt=""
                  style={{width: '100%', height: 'auto'}}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="display-5 mb-3">About Me</h2>
              <p className="lead fs-lg">
                My name is Caitlyn, and I specialize in capturing food,
                beverages, and photography of products.
              </p>
              <p>
                Menu selection is a crucial aspect of restaurant services, as it
                determine the types of dishes and drinks that will be available
                to customers. Food preparation also plays a critical role, as
                the quality and taste of the dishes will ultimately determine
                customer satisfaction. Table service involves how the restaurant
                staff interacts with customers.
              </p>
              <p>
                Restaurant services refer to the various elements that make up
                the dining experience at a restaurant. Include menu selection,
                food preparation, table service. Restaurant services refer to
                the various elements that make up the dining experience.
              </p>

              <NextLink
                title="Learn More"
                href="#"
                className="btn btn-primary rounded-pill mt-2"
              />
            </div>
          </div>

          <div className="row gx-md-8 gx-xl-12 mt-10 mt-md-13">
            <div className="col-lg-4">
              <h2 className="display-5 mb-3">My Working Process</h2>
              <p>
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                auctor. Fusce dapibus, tellus ac cursus. Aenean eu leo quam.
              </p>
            </div>

            <div className="col-lg-8">
              <div className="row gy-6 gx-md-8 gx-xl-12">
                {processList12.map(({no, ...item}) => (
                  <div className="col-md-6" key={no}>
                    <ServiceCard3
                      {...item}
                      Icon={
                        <span className="icon btn btn-circle btn-primary pe-none me-4">
                          <span className="number fs-18">{no}</span>
                        </span>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About25;
