import {FC} from 'react';
import Accordion from '@/subapps/templates/common/components/reuseable/accordion';
// -------- data -------- //
import {accordions} from '@/subapps/templates/common/data/demo-8';

const FAQ3: FC = () => {
  return (
    <div className="card bg-soft-primary rounded-4">
      <div className="card-body p-md-10 p-xl-11">
        <div className="row gx-lg-8 gx-xl-12 gy-10">
          <div className="col-lg-6">
            <h3 className="display-4 mb-4">Frequently Asked Questions</h3>
            <p className="lead fs-lg mb-0">
              Genuinely lack a response to your query, please use the form below
              to drop us a message.
            </p>
          </div>

          <div className="col-lg-6">
            <div className="accordion accordion-wrapper" id="accordionExample">
              {accordions.map(item => (
                <Accordion type="plain" key={item.no} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ3;
