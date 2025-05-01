import {FC} from 'react';
import Link from 'next/link';
import Image from 'next/image';
// -------- custom hook -------- //
import useLightBox from '@/subapps/templates/common/hooks/useLightBox';
// -------- custom component -------- //
import Carousel from '@/subapps/templates/common/components/reuseable/Carousel';
import ShareButton from '@/subapps/templates/common/components/common/ShareButton';
import FigureImage from '@/subapps/templates/common/components/reuseable/FigureImage';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';
import SocialLinks from '@/subapps/templates/common/components/reuseable/SocialLinks';
import BlogCommentList from '@/subapps/templates/common/components/common/BlogCommentList';
import {BlogCard1} from '@/subapps/templates/common/components/reuseable/blog-cards';
// -------- data -------- //
const tags = [
  {id: 1, title: 'Graphic', url: '#'},
  {id: 2, title: 'UI/UX', url: '#'},
  {id: 3, title: 'Skatch', url: '#'},
];

const images = [
  {id: 1, url: '/img/photos/b8.jpg', full: '/img/photos/b8-full.jpg'},
  {id: 2, url: '/img/photos/b9.jpg', full: '/img/photos/b9-full.jpg'},
  {id: 3, url: '/img/photos/b10.jpg', full: '/img/photos/b10-full.jpg'},
  {id: 4, url: '/img/photos/b11.jpg', full: '/img/photos/b11-full.jpg'},
];

const blogs = [
  {
    id: 1,
    link: '#',
    category: 'Coding',
    date: '14 Apr 2022',
    image: '/img/photos/b4.jpg',
    title: 'Excellent customer service',
  },
  {
    id: 2,
    link: '#',
    date: '14 Apr 2022',
    category: 'Workspace',
    image: '/img/photos/b5.jpg',
    title: 'Work from home',
  },
  {
    id: 3,
    link: '#',
    date: '14 Apr 2022',
    category: 'Meeting',
    image: '/img/photos/b6.jpg',
    title: 'Ultricies fusce porta elit',
  },
];

const BlogDetailsTemplate: FC = () => {
  // used for image lightbox
  useLightBox();

  return (
    <div className="card">
      <FigureImage
        width={960}
        height={600}
        src="/img/photos/b1.jpg"
        className="card-img-top"
      />

      <div className="card-body">
        <div className="classic-view">
          <article className="post">
            <div className="post-content mb-5">
              <h2 className="h1 mb-4">Excellent customer service</h2>

              <p>
                Terms and conditions, often referred to as T&C or terms of
                service, are legal agreements between a business or service
                provider and its users or customers. These agreements outline
                the rules, rights, and obligations that govern the relationship
                between the parties involved. Here are some common components
                typically found in terms and conditions descriptions Terms and
                conditions, often referred to as T&C or terms of service, are
                legal agreements business or service provider users or
                customers.
              </p>

              <p>
                Terms and conditions, often referred to as T&C or terms of
                service, are legal agreements between a business or service
                provider and its users or customers. These agreements outline
                the rules, rights, and obligations that govern the relationship
                between the parties involved. Here are some common components
                typically found in terms and conditions descriptions.
              </p>

              <div className="row g-6 mt-3 mb-10">
                {images.map(({id, url, full}) => (
                  <div key={id} className="col-md-6">
                    <figure className="hover-scale rounded cursor-dark">
                      <a href={full} data-glightbox data-gallery="post">
                        <Image
                          width={460}
                          height={307}
                          src={url}
                          alt="demo"
                          style={{width: '100%', height: 'auto'}}
                        />
                      </a>
                    </figure>
                  </div>
                ))}
              </div>

              <p>
                Terms and conditions, often referred to as T&C or terms of
                service, are legal agreements between a business or service
                provider and its users or customers. These agreements outline
                the rules, rights, and obligations that govern the relationship
                between the parties involved. Here are some common components
                typically found in terms and conditions descriptions Terms and
                conditions, often referred to as T&C or terms of service, are
                legal agreements business or service provider users or
                customers. Terms and conditions, often referred.
              </p>

              <blockquote className="fs-lg my-8">
                <p>
                  Terms and conditions, often referred to as T&C or terms of
                  service, are legal agreements between a business or service
                  provider and its users or customers.
                </p>

                <footer className="blockquote-footer">
                  Very important person
                </footer>
              </blockquote>

              <h3 className="h2 mb-4">Creative Ideas about UI and UX design</h3>

              <p>
                Terms and conditions, often referred to as T&C or terms of
                service, are legal agreements between a business or service
                provider and its users or customers. These agreements outline
                the rules, rights, and obligations that govern the relationship
                between the parties involved. Here are some common components
                typically found in terms and conditions description.
              </p>

              <p>
                Terms and conditions, often referred to as T&C or terms of
                service, are legal agreements between a business or service
                provider and its users or customers. These agreements outline
                the rules, rights, and obligations that govern the relationship
                between the parties involved. Here are some common components
                typically found in terms and conditions descriptions Terms and
                conditions, often referred to as T&C or terms of service, are
                legal agreements business or service provider users or
                customers. Terms and conditions, often referred to as T&C or
                terms of service.
              </p>
            </div>

            <div className="post-footer d-md-flex flex-md-row justify-content-md-between align-items-center mt-8">
              <div>
                <ul className="list-unstyled tag-list mb-0">
                  {tags.map(({id, title, url}) => (
                    <li key={id}>
                      <NextLink
                        href={url}
                        title={title}
                        className="btn btn-soft-ash btn-sm rounded-pill mb-0"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-0 mb-md-2">
                <ShareButton btnSize="btn-sm" />
              </div>
            </div>
          </article>
        </div>

        <hr />

        <div className="author-info d-md-flex align-items-center mb-3">
          <div className="d-flex align-items-center">
            <FigureImage
              width={120}
              height={120}
              src="/img/avatars/u5.jpg"
              className="user-avatar rounded-circle overflow-hidden"
            />

            <div>
              <h6>
                <NextLink
                  title="Nikolas Brooten"
                  href="#"
                  className="link-dark"
                />
              </h6>

              <span className="post-meta fs-15">Finance Manager</span>
            </div>
          </div>

          <div className="mt-3 mt-md-0 ms-auto">
            <Link
              href="#"
              className="btn btn-sm btn-soft-ash rounded-pill btn-icon btn-icon-start mb-0">
              <i className="uil uil-file-alt" /> All Posts
            </Link>
          </div>
        </div>

        <p>
          Terms and conditions, often referred to as T&C or terms of service,
          are legal agreements between a business or service provider and its
          users or customers. These agreements outline the rules, rights, and
          obligations that govern the relationship.
        </p>

        <SocialLinks className="nav social" />

        <hr />

        <h3 className="mb-6">You Might Also Like</h3>

        <div className="swiper-container blog grid-view mb-16">
          <Carousel
            grabCursor
            slidesPerView={2}
            navigation={false}
            breakpoints={{0: {slidesPerView: 1}, 768: {slidesPerView: 2}}}>
            {blogs.map(({id, ...item}) => (
              <BlogCard1 key={id} {...item} />
            ))}
          </Carousel>
        </div>

        <hr />

        <div id="comments">
          <h3 className="mb-6">5 Comments</h3>
          <BlogCommentList />
        </div>

        <hr />

        <form className="comment-form">
          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Name*"
              id="c-name"
            />
            <label htmlFor="c-name">Name *</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email*"
              id="c-email"
            />
            <label htmlFor="c-email">Email*</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Website"
              id="c-web"
            />
            <label htmlFor="c-web">Website</label>
          </div>

          <div className="form-floating mb-4">
            <textarea
              name="textarea"
              placeholder="Comment"
              className="form-control"
              style={{height: 150}}
            />
            <label>Comment *</label>
          </div>

          <button type="submit" className="btn btn-primary rounded-pill mb-0">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetailsTemplate;
