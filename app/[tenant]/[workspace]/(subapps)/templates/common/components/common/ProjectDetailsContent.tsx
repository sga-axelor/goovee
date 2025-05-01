import {FC} from 'react';
import NextLink from 'components/reuseable/links/NextLink';

// =======================================================
type ProjectDetailsContentProps = {
  title: string;
  titleClass?: string;
  contentRowClass?: string;
};
// =======================================================

const ProjectDetailsContent: FC<ProjectDetailsContentProps> = ({
  title,
  contentRowClass = 'row gx-0',
  titleClass = 'display-6 mb-4',
}) => {
  return (
    <div className="row">
      <div className="col-lg-10 offset-lg-1">
        <h2 className={titleClass}>{title}</h2>

        <div className={contentRowClass}>
          <div className="col-md-9 text-justify">
            <p>
              Terms and conditions, often referred to as T&C or terms of
              service, are legal agreements between a business or service
              provider and its users or customers. These agreements outline the
              rules, rights, and obligations that govern the relationship
              between the parties involved.
            </p>
            <p>
              Terms and conditions, often referred to as T&C or terms of
              service, are legal agreements between a business or service
              provider and its users or customers. These agreements outline the
              rules, rights, and obligations that govern the relationship
              between the parties involved. Here are some common components
              typically found in terms and conditions descriptions:
            </p>
          </div>

          <div className="col-md-2 ms-auto">
            <ul className="list-unstyled">
              <li>
                <h5 className="mb-1">Date</h5>
                <p>17 May 2018</p>
              </li>

              <li>
                <h5 className="mb-1">Client Name</h5>
                <p>Cool House</p>
              </li>
            </ul>

            <NextLink title="See Project" href="#" className="more hover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsContent;
