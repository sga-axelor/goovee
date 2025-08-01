import AccordionList from '@/subapps/website/common/components/common/AccordionList';
import type {TemplateProps} from '@/subapps/website/common/types';
import {type About2Data} from './meta';
import {getMetaFileURL} from '@/subapps/website/common/utils/helper';

export function About2(props: TemplateProps<About2Data>) {
  const {data} = props;
  const {
    about2Title: title,
    about2Caption: caption,
    about2Image,
    about2Accordions: accordionsList,
  } = data || {};

  const image = getMetaFileURL({
    metaFile: about2Image,
    path: 'about2Image',
    ...props,
  });

  const accordions =
    accordionsList?.map(({id, attrs: item}) => ({
      id,
      expand: item.expand,
      heading: item.heading,
      body: item.body,
    })) ?? [];

  return (
    <section className="wrapper bg-light angled upper-start lower-start">
      <div className="container pb-14 pb-md-15">
        <div className="row gx-lg-8 gx-xl-12 gy-10 mb-lg-22 mb-xl-24 align-items-center">
          <div className="col-lg-7">
            <figure>
              <img alt="choose us" className="w-auto" src={image} />
            </figure>
          </div>

          <div className="col-lg-5">
            <h2 className="fs-16 text-uppercase text-muted mb-3">{title}</h2>
            <h3 className="display-4 mb-7">{caption}</h3>

            <AccordionList accordions={accordions} />
          </div>
        </div>
      </div>
    </section>
  );
}
