import ListColumn from '@/subapps/website/common/components/reuseable/ListColumn';
// -------- data -------- //
import {aboutList1} from '@/subapps/website/common/data/about';
import {TemplateProps} from '../../../types';

type Services2Data = {
  services2Title: string;
  services2Caption: string;
  services2Description: string;
  services2Image: string;
};

export function Services2(props: TemplateProps<Services2Data>) {
  const {data} = props;
  const {
    services2Image: image,
    services2Title: title,
    services2Caption: caption,
    services2Description: description,
  } = data || {};

  return (
    <section className="wrapper bg-light">
      <div className="container">
        <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
          <div className="col-lg-7 order-lg-2">
            <figure className="text-center">
              <img className="w-auto" alt="our solutions" src={image} />
            </figure>
          </div>

          <div className="col-lg-5">
            <h2 className="fs-16 text-uppercase text-muted mb-3">{title}</h2>
            <h3 className="display-4 mb-5">{caption}</h3>

            <p className="mb-6">{description}</p>
            {/* TODO:  use dynamic list later */}
            <ListColumn list={aboutList1} />
          </div>
        </div>
      </div>
    </section>
  );
}
