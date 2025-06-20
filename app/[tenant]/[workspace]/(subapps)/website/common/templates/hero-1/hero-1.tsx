import type {TemplateProps} from '@/subapps/website/common/types';

type Hero1Data = {
  heroTitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImage: string;
};

export function Hero1(props: TemplateProps<Hero1Data>) {
  const {data} = props;
  const {
    heroTitle: title,
    heroDescription: description,
    heroButtonText: buttonText,
    heroButtonLink: buttonLink,
    heroImage: image,
  } = data || {};

  return (
    <section className="wrapper bg-gradient-primary">
      <div className="container pt-10 pt-md-14 pb-8 text-center">
        <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
          <div className="col-md-10 offset-md-1 offset-lg-0 col-lg-6 text-center text-lg-start">
            <h1 className="display-1 mb-5 mx-md-n5 mx-lg-0">{title}</h1>
            {description && <p className="lead fs-lg mb-7">{description}</p>}
            {buttonText && (
              <a
                className="btn btn-primary rounded-pill me-2"
                href={buttonLink ?? '#'}>
                {buttonText}
              </a>
            )}
          </div>

          <div className="col-lg-6">
            {image && (
              <figure>
                <img alt="hero" className="w-auto" src={image} />
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
