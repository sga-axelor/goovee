import {FC} from 'react';
// -------- custom component -------- //
import Carousel from 'components/reuseable/Carousel';
import carouselBreakpoints from 'utils/carouselBreakpoints';
import NextLink from 'components/reuseable/links/NextLink';
import {TeamCard2} from 'components/reuseable/team-cards';
// -------- data -------- //
import {teams2} from 'data/team-list';

const Team2: FC = () => {
  return (
    <div className="row gx-lg-8 gx-xl-12 gy-10 mb-16 mb-md-17 mb-xl-20 align-items-center">
      <div className="col-lg-4">
        <h2 className="fs-15 text-uppercase text-muted mb-3">Meet the Team</h2>
        <h3 className="display-6 mb-5">
          Choose our team to enjoy the benefits of efficient & cost-effective
          solutions
        </h3>
        <p className="fs-15">
          Maximize your resources with our professional team's time and
          cost-effective solutions. Partner with us to save valuable time and
          money.
        </p>

        <NextLink
          title="See All Members"
          href="#"
          className="btn btn-primary rounded-pill mt-3"
        />
      </div>

      <div className="col-lg-8">
        <div className="swiper-container text-center mb-6">
          <Carousel
            grabCursor
            navigation={false}
            breakpoints={carouselBreakpoints}>
            {teams2.map(team => (
              <TeamCard2 key={team.id} {...team} />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Team2;
