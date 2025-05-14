import {FC} from 'react';
import Accordion from '@/subapps/website/common/components/reuseable/accordion';
// -------- data -------- //
import {accordionList2} from '@/subapps/website/common/data/faq';

// ============================================================
type Faq2Props = {titleColor?: 'primary' | 'muted'};
// ============================================================

const FAQ2: FC<Faq2Props> = ({titleColor = 'primary'}) => {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container py-14 py-md-16">
        <div className="row">
          <div className="col-lg-11 col-xxl-10 mx-auto text-center">
            <h2 className={`fs-15 text-uppercase text-${titleColor} mb-3`}>
              FAQ
            </h2>
            <h3 className="display-5 mb-10 px-lg-12 px-xl-10 px-xxl-17">
              If you cannot locate a solution to your query, please use our
              contact page to send us a message.
            </h3>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="accordion-wrapper" id="accordion">
              {accordionList2.map(item => (
                <Accordion key={item.no} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ2;
