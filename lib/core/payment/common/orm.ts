import {PaymentOption} from '@/types';
import {manager, type Tenant} from '@/tenant';

const PAYMET_STATUS = {
  pending: 'pending',
  completed: 'completed',
};

export async function createPaymentContext({
  context,
  mode,
  payer,
  tenantId,
}: {
  context: any;
  mode: PaymentOption;
  payer: string;
  tenantId: Tenant['id'];
}): Promise<{
  id: string;
  version: number;
}> {
  const client = await manager.getClient(tenantId);

  if (!client) throw new Error('Client not found');
  const timeStamp = new Date();

  const payment = await client.payment.create({
    data: {
      mode,
      payer,
      context,
      createdOn: timeStamp,
      updatedOn: timeStamp,
      status: PAYMET_STATUS.pending,
    },
    select: {id: true},
  });
  return payment;
}

const CONTEXT_VALIDITY_DURATION = 1000 * 60 * 5; // 5 minutes
export async function findPaymentContext({
  id,
  tenantId,
  mode,
}: {
  id: string;
  tenantId: Tenant['id'];
  mode: PaymentOption;
}) {
  const client = await manager.getClient(tenantId);

  if (!client) throw new Error('Client not found');

  const payment = await client.payment.findOne({
    where: {
      id,
      mode,
      status: PAYMET_STATUS.pending,
    },
    select: {context: true, createdOn: true},
  });

  if (!payment) return null;

  if (payment.createdOn!.getTime() + CONTEXT_VALIDITY_DURATION < Date.now()) {
    return null;
  }

  return (await payment.context) as any;
}

export async function markPaymentAsCompleted({
  paymentId,
  tenantId,
}: {
  paymentId: string;
  tenantId: Tenant['id'];
}) {
  const client = await manager.getClient(tenantId);

  if (!client) throw new Error('Client not found');

  const payment = await client.payment.findOne({
    where: {id: paymentId},
    select: {version: true},
  });

  if (!payment) throw new Error('Payment not found');

  const timeStamp = new Date();
  await client.payment.update({
    data: {
      id: paymentId,
      version: payment.version,
      status: PAYMET_STATUS.completed,
      updatedOn: timeStamp,
    },
  });
}
