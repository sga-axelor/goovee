// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findOrder} from '@/subapps/orders/common/orm/orders';

export default async function Page({params}: {params: {id: string}}) {
  const {id} = params;

  const order = await findOrder(id);
  return <Content order={clone(order)} />;
}
