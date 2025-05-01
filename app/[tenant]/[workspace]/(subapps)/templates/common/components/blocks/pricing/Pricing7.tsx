import {FC, useState} from 'react';
import Switch from 'components/reuseable/Switch';
import NextLink from 'components/reuseable/links/NextLink';
import {PricingCard1} from 'components/reuseable/pricing-cards';
// -------- data -------- //
import {pricingList1} from 'data/pricing';

const Pricing7: FC = () => {
  const [activeYearly, setActiveYearly] = useState(false);

  return (
    <div className="row gy-6 gy-lg-0 mb-10 mb-md-18">
      <div className="col-lg-4">
        <h2 className="display-5 mt-lg-18 mb-3">Our Competitive Pricing</h2>
        <p>
          We provide affordable costs and high-quality items for your business.
        </p>
        <p className="mb-5 lead">
          Take advantage of our{' '}
          <NextLink title="free 30-day trial" href="#" className="hover" /> to
          experience our full range of services.
        </p>

        <NextLink
          href="#"
          title="See All Prices"
          className="btn btn-primary rounded-pill mt-2"
        />
      </div>

      <div className="col-lg-7 offset-lg-1 pricing-wrapper">
        <div className="pricing-switcher-wrapper switcher justify-content-start justify-content-lg-end">
          <p className="mb-0 pe-3">Monthly</p>

          <Switch value={activeYearly} onChange={setActiveYearly} />

          <p className="mb-0 ps-3">
            Yearly <span className="text-red">(Save 30%)</span>
          </p>
        </div>

        <div className="row gy-6 mt-5">
          {pricingList1.map((item, i) => (
            <div className={`col-md-6 ${i === 1 && 'popular'}`} key={i}>
              <PricingCard1 bulletBg {...item} activeYearly={activeYearly} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing7;
