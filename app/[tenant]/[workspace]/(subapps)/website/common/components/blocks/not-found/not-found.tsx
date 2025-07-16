import Image from 'next/image';
import NextLink from '../../reuseable/links/NextLink';
import notFound from '@/public/img/illustrations/404.png';
import {i18n} from '@/locale';

export function NotFound({homePageUrl}: {homePageUrl?: string}) {
  return (
    <main className="content-wrapper">
      <section className="wrapper bg-light">
        <div className="container pt-12 pt-md-14 pb-14 pb-md-16">
          <div className="row">
            <div className="col-lg-9 col-xl-8 mx-auto text-center">
              <Image src={notFound} className="mb-10" alt="404 - Not Found" />
            </div>

            <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto text-center">
              <h1 className="mb-3">{i18n.t('404 Error Page!')}</h1>
              <p className="lead mb-7 px-md-12 px-lg-5 px-xl-7">
                {i18n.t('The page you are looking for does not exist.')}
              </p>

              <NextLink
                title={i18n.t('Go to Homepage')}
                href={homePageUrl || '/'}
                className="btn btn-primary rounded-pill"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
