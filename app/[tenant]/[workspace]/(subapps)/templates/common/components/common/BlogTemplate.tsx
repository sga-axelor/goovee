import Plyr from 'plyr-react';
import Image from 'next/image';
import {FC, Fragment} from 'react';
// -------- custom component -------- //
import Carousel from '@/subapps/templates/common/components/reuseable/Carousel';
import Pagination from '@/subapps/templates/common/components/reuseable/Pagination';
import {
  BlogCard2,
  BlogCard3,
} from '@/subapps/templates/common/components/reuseable/blog-cards';
// -------- data -------- //
const blogs = [
  {
    id: 1,
    link: '#',
    category: 'Coding',
    image: '/img/photos/b4.jpg',
    title: 'Excellent customer service',
    description: `Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers.`,
  },
  {
    id: 2,
    link: '#',
    category: 'Workspace',
    image: '/img/photos/b5.jpg',
    title: 'Work from home',
    description: `Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers.`,
  },
  {
    id: 3,
    link: '#',
    category: 'Meeting',
    image: '/img/photos/b6.jpg',
    title: 'New place for meeting',
    description: `Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers.`,
  },
  {
    id: 4,
    link: '#',
    category: 'Business Tips',
    image: '/img/photos/b7.jpg',
    title: 'Increase business growth',
    description: `Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers.`,
  },
];

const BlogTemplate: FC = () => {
  return (
    <Fragment>
      <div className="blog classic-view">
        <BlogCard2
          link="#"
          category="TEAMWORK"
          title="Excellent customer service"
          description="Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers. These agreements outline the rules, rights, and obligations that govern the relationship between the parties involved. Here are some common components typically found in terms and conditions descriptions Terms and conditions, often referred to as T&C or terms of service, are legal agreements business or service provider users or customers."
          cardTop={
            <figure className="card-img-top overlay overlay-1 hover-scale">
              <a className="link-dark" href="#">
                <Image
                  alt="blog"
                  width={960}
                  height={600}
                  src="/img/photos/b1.jpg"
                  style={{width: '100%', height: 'auto'}}
                />
                <span className="bg" />
              </a>

              <figcaption>
                <h5 className="from-top mb-0">Read More</h5>
              </figcaption>
            </figure>
          }
        />

        <BlogCard2
          link="#"
          category="IDEAS"
          title="Creative Ideas about UI and UX design"
          description="Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers. These agreements outline the rules, rights, and obligations that govern the relationship between the parties involved. Here are some common components typically found in terms and conditions descriptions Terms and conditions, often referred to as T&C or terms of service, are legal agreements business or service provider users or customers."
          cardTop={
            <div className="post-slider card-img-top">
              <div className="swiper-container dots-over">
                <Carousel grabCursor spaceBetween={5} slidesPerView={1}>
                  <Image
                    alt=""
                    width={960}
                    height={600}
                    src="/img/photos/b2.jpg"
                    style={{width: '100%', height: 'auto'}}
                  />
                  <Image
                    alt=""
                    width={960}
                    height={600}
                    src="/img/photos/b3.jpg"
                    style={{width: '100%', height: 'auto'}}
                  />
                </Carousel>
              </div>
            </div>
          }
        />

        <BlogCard2
          link="#"
          category="WORKSPACE"
          title="How a developer can easily work on site."
          description="Terms and conditions, often referred to as T&C or terms of service, are legal agreements between a business or service provider and its users or customers. These agreements outline the rules, rights, and obligations that govern the relationship between the parties involved. Here are some common components typically found in terms and conditions descriptions Terms and conditions, often referred to as T&C or terms of service, are legal agreements business or service provider users or customers."
          cardTop={
            <div className="card-img-top">
              <Plyr
                options={{loadSprite: true, clickToPlay: true}}
                source={{
                  type: 'video',
                  sources: [{src: '384822055', provider: 'vimeo'}],
                }}
              />
            </div>
          }
        />
      </div>

      <div className="blog grid grid-view">
        <div className="row isotope gx-md-8 gy-8 mb-8">
          {blogs.map(item => (
            <BlogCard3 {...item} key={item.id} />
          ))}
        </div>
      </div>

      {/* ========== pagination section ========== */}
      <Pagination className="justify-content-start" />
    </Fragment>
  );
};

export default BlogTemplate;
