import {FC, Fragment} from 'react';
import Accordion from '@/subapps/website/common/components/reuseable/accordion';
// -------- data -------- //
import {accordionList4} from '@/subapps/website/common/data/faq';

const FAQ1: FC = () => {
  return (
    <Fragment>
      <h2 className="fs-15 text-uppercase text-muted mb-3 text-center">FAQ</h2>
      <h3 className="display-4 mb-10 px-lg-12 text-center">
        If you are unable to locate the answer to your query, you may send us an
        email using our contact page.
      </h3>

      <div className="accordion-wrapper" id="accordion">
        <div className="row">
          {accordionList4.map((items, i) => (
            <div className="col-md-6" key={i}>
              {items.map(item => (
                <Accordion key={item.no} {...item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default FAQ1;
