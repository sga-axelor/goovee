import {FC, Fragment} from 'react';
// -------- icons -------- //
import Bulb from '@/subapps/website/common/icons/solid-mono/Bulb';
import Compare from '@/subapps/website/common/icons/solid-mono/Compare';
import DeliveryBox from '@/subapps/website/common/icons/solid-mono/DeliveryBox';
// -------- custom component -------- //
import NextLink from '@/subapps/website/common/components/reuseable/links/NextLink';
import CheckShield from '@/subapps/website/common/icons/solid/CheckShield';
import Dollar from '@/subapps/website/common/icons/solid/Dollar';
import Update from '@/subapps/website/common/icons/solid/Update';

const Services22: FC = () => {
  return (
    <Fragment>
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mx-auto text-center">
          <h2 className="fs-16 text-uppercase text-muted mb-3">
            Why Choose Lighthouse?
          </h2>
          <h3 className="display-3 mb-10 px-xl-10">
            Here are a small number of the{' '}
            <span className="underline-3 style-2 yellow">reasons</span> why our
            customers use Lighthouse.
          </h3>
        </div>
      </div>

      <ul
        role="tablist"
        className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-between nav-justified flex-lg-row flex-column">
        <li className="nav-item" role="presentation">
          <a
            role="tab"
            href="#tab2-1"
            data-bs-toggle="tab"
            aria-selected="true"
            className="nav-link d-flex flex-row active">
            <div>
              <CheckShield className="solid icon-svg-sm text-fuchsia me-4" />
            </div>

            <div>
              <h4 className="mb-1">Easy Usage</h4>
              <p>Customers may choose company offer high-quality product.</p>
            </div>
          </a>
        </li>

        <li className="nav-item" role="presentation">
          <a
            role="tab"
            tabIndex={-1}
            href="#tab2-2"
            data-bs-toggle="tab"
            aria-selected="false"
            className="nav-link d-flex flex-row">
            <div>
              <Dollar className="solid icon-svg-sm text-fuchsia me-4" />
            </div>

            <div>
              <h4 className="mb-1">Fast Transactions</h4>
              <p>Customers may choose company offer high-quality product.</p>
            </div>
          </a>
        </li>

        <li className="nav-item" role="presentation">
          <a
            role="tab"
            tabIndex={-1}
            href="#tab2-3"
            data-bs-toggle="tab"
            aria-selected="false"
            className="nav-link d-flex flex-row">
            <div>
              <Update className="solid icon-svg-sm text-fuchsia me-4" />
            </div>

            <div>
              <h4 className="mb-1">Secure Payments</h4>
              <p>Customers may choose company offer high-quality product.</p>
            </div>
          </a>
        </li>
      </ul>

      {/* ========== tab content ========== */}
      <div className="tab-content mt-6 mt-lg-8">
        <div className="tab-pane fade active show" id="tab2-1" role="tabpanel">
          <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
            <div className="col-lg-6">
              <figure className="rounded shadow-lg">
                <img
                  src="/img/photos/se5.jpg"
                  srcSet="/img/photos/se5@2x.jpg 2x"
                  alt=""
                />
              </figure>
            </div>

            <List title="Easy Usage" />
          </div>
        </div>

        <div className="tab-pane fade" id="tab2-2" role="tabpanel">
          <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
            <div className="col-lg-6 order-lg-2">
              <figure className="rounded shadow-lg">
                <img
                  src="/img/photos/se6.jpg"
                  srcSet="/img/photos/se6@2x.jpg 2x"
                  alt=""
                />
              </figure>
            </div>

            <List title="Fast Transactions" />
          </div>
        </div>

        <div className="tab-pane fade" id="tab2-3" role="tabpanel">
          <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
            <div className="col-lg-6">
              <figure className="rounded shadow-lg">
                <img
                  src="/img/photos/se7.jpg"
                  srcSet="/img/photos/se7@2x.jpg 2x"
                  alt=""
                />
              </figure>
            </div>

            <List title="Secure Payments" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const List = ({title}: {title: string}) => {
  return (
    <div className="col-lg-6">
      <h2 className="mb-3">{title}</h2>
      <p>
        Customers may choose your company because you provide excellent customer
        service that makes them feel valued and appreciated. This can include
        fast response times, personalized attention. Customers may choose your
        company because you provide excellent customer service.
      </p>

      <ul className="icon-list bullet-bg bullet-soft-fuchsia">
        <li>
          <i className="uil uil-check" /> Customers may choose company offer
          high-quality product.
        </li>
        <li>
          <i className="uil uil-check" /> Customers may choose company offer
          high-quality product.
        </li>
        <li>
          <i className="uil uil-check" /> Customers may choose company offer
          high-quality product.
        </li>
      </ul>

      <NextLink title="Learn More" href="#" className="btn btn-fuchsia mt-2" />
    </div>
  );
};

export default Services22;
