import About from '@/subapps/website/common/components/blocks/about/About1';
import type {TemplateProps} from '@/subapps/website/common/types';
export function About1(props: TemplateProps) {
  const {data} = props;
  return (
    <section className="wrapper bg-light angled upper-start lower-start">
      <div className="container py-14 pt-md-17 pb-md-15">
        <About />
      </div>
    </section>
  );
}
