import {FC} from 'react';
import Link from 'next/link';
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';

const Services27: FC = () => {
  return (
    <section id="services">
      <div className="wrapper bg-gray">
        <div className="container py-15 py-md-17">
          <div className="row gx-lg-0 gy-10 align-items-center">
            <div className="col-lg-6">
              <div className="row g-6 text-center">
                <div className="col-md-6">
                  <Card
                    title="Products"
                    image="/img/photos/fs4.jpg"
                    className="mb-6"
                  />
                  <Card title="Recipes" image="/img/photos/fs6.jpg" />
                </div>

                <div className="col-md-6">
                  <Card
                    title="Restaurants"
                    image="/img/photos/fs5.jpg"
                    className="mt-md-6 mb-6"
                  />
                  <Card title="Still Life" image="/img/photos/fs7.jpg" />
                </div>
              </div>
            </div>

            <div className="col-lg-5 offset-lg-1">
              <h2 className="display-5 mb-3">My Services</h2>
              <p className="lead fs-lg">
                Restaurant services refer to the various elements that make up
                the dining experience at a restaurant. Include menu selection,
                food preparation, table service.
              </p>
              <p>
                Menu selection is a crucial aspect of restaurant services, as it
                determine the types of dishes and drinks that will be available
                to customers. Food preparation also plays a critical role, as
                the quality and taste of the dishes will ultimately determine
                customer satisfaction. Table service involves how the restaurant
                staff interacts with customers.
              </p>

              <NextLink
                title="More Details"
                href="#"
                className="btn btn-primary rounded-pill mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ------------------------------------------------------------------------------------------
type CardProps = {image: string; title: string; className?: string};

const Card: FC<CardProps> = ({image, title, className = ''}) => (
  <div className={`card shadow-lg ${className}`}>
    <figure className="card-img-top overlay overlay-1">
      <Link href="#" passHref>
        <img className="img-fluid" src={image} alt="" />
        <span className="bg" />
      </Link>

      <figcaption>
        <h5 className="from-top mb-0">View Gallery</h5>
      </figcaption>
    </figure>

    <div className="card-body p-4">
      <h3 className="h4 mb-0">{title}</h3>
    </div>
  </div>
);

export default Services27;
