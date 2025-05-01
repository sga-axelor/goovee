import {FC} from 'react';

const Testimonial9: FC = () => {
  return (
    <div className="card bg-soft-primary rounded-4 mb-14 mb-md-18">
      <div className="card-body p-md-10 py-xxl-16 position-relative">
        <div
          className="position-absolute d-none d-lg-block"
          style={{bottom: 0, left: '5%', width: '35%', zIndex: 2}}>
          <figure>
            <img
              src="/img/photos/co4.png"
              srcSet="/img/photos/co4@2x.png 2x"
              alt=""
            />
          </figure>
        </div>

        <div className="row gx-md-0 gx-xl-12 text-center">
          <div className="col-lg-7 offset-lg-5 col-xl-6">
            <span className="ratings five mb-3" />

            <blockquote className="border-0 fs-lg mb-0">
              <p>
                “I wanted to share my positive experience working with your
                team. From start to finish, the process was smooth and
                efficient, and the end result exceeded my expectations. Your
                team's attention to detail, creativity, and responsiveness was
                impressive. I appreciate how you took the time to understand my
                needs”
              </p>

              <div className="blockquote-details justify-content-center text-center">
                <div className="info p-0">
                  <h5 className="mb-1">Ethan Johnson</h5>
                  <div className="meta mb-0">MARKETING MANAGER</div>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial9;
