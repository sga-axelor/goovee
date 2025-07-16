import {TemplateProps} from '../../types';

import type {Clients1Data} from './meta';

export function Clients1(props: TemplateProps<Clients1Data>) {
  const {data} = props;
  const {clients1ClientList: clientList} = data || {};

  return (
    <section className="wrapper bg-light angled upper-end lower-end">
      <div className="container pb-14 pb-md-18">
        <div className="px-lg-5">
          <div className="row gx-0 gx-md-8 gx-xl-12 gy-8 align-items-center">
            {clientList?.map(({id, attrs: item}) => (
              <div className="col-4 col-md-2" key={id}>
                <figure className="px-5 px-md-0 px-lg-2 px-xl-3 px-xxl-4">
                  <img src={item.image} alt="client" />
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
