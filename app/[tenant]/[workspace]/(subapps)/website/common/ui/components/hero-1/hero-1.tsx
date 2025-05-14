import Hero from '@/subapps/website/common/components/blocks/hero/Hero1';
import type {TemplateProps} from '@/subapps/website/common/types';

export function Hero1(props: TemplateProps) {
  const {data} = props;
  return (
    <section className="wrapper bg-gradient-primary">
      <div className="container pt-10 pt-md-14 pb-8 text-center">
        <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
          <div className="col-md-10 offset-md-1 offset-lg-0 col-lg-6 text-center text-lg-start">
            <h1 className="display-1 mb-5 mx-md-n5 mx-lg-0">{data?.title}</h1>
            {data?.description && (
              <p className="lead fs-lg mb-7">{data?.description}</p>
            )}
            {data.link && (
              <a className="btn btn-primary rounded-pill me-2">{data.link}</a>
            )}
          </div>

          <div className="col-lg-6">
            {data?.image && (
              <figure>
                <img alt="hero" className="w-auto" src={data.image} />
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
