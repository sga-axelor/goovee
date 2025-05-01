import {FC, useState} from 'react';
import Switch from '@/subapps/templates/common/components/reuseable/Switch';
import NextLink from '@/subapps/templates/common/components/reuseable/links/NextLink';
import {PricingCard1} from '@/subapps/templates/common/components/reuseable/pricing-cards';
// -------- data -------- //
import {pricingList1} from '@/subapps/templates/common/data/pricing';

const Pricing6: FC = () => {
  const [activeYearly, setActiveYearly] = useState(false);

  return (
    <div className="row gy-6 align-items-center">
      <div className="col-lg-4">
        <h2 className="fs-15 text-uppercase text-muted mb-3">Our Pricing</h2>
        <h3 className="display-5 mb-5">
          We provide perfect and competitive prices.
        </h3>

        <p className="mb-5">
          Take advantage of our{' '}
          <NextLink title="free 30-day trial" href="#" className="hover" /> to
          experience our full range of services.
        </p>

        <NextLink
          href="#"
          title="See All Prices"
          className="btn btn-primary rounded mt-2"
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
              <PricingCard1
                roundedButton
                bulletBg
                {...item}
                activeYearly={activeYearly}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing6;
