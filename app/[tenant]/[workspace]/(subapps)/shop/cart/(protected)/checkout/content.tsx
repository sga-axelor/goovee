'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {PayPalScriptProvider, PayPalButtons} from '@paypal/react-paypal-js';

// ---- CORE IMPORTS ---- //
import {
  Separator,
  Label,
  RadioGroup,
  RadioGroupItem,
  Button,
  BackgroundImage,
  Loader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/components';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {scale} from '@/utils';
import {computeTotal} from '@/utils/cart';
import {useSearchParams, useToast} from '@/ui/hooks';
import {getImageURL} from '@/utils/product';
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findProduct} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart';
import styles from './content.module.scss';
import {
  createStripeCheckoutSession,
  findAddress,
  findDeliveryAddress,
  findInvoicingAddress,
  paypalCaptureOrder,
  paypalCreateOrder,
  validateStripePayment,
} from './action';

const SHIPPING_TYPE = {
  REGULAR: 'regular',
  FAST: 'fast',
};

const SHIPPING_TYPE_COST = {
  [SHIPPING_TYPE.REGULAR]: 2,
  [SHIPPING_TYPE.FAST]: 5,
};

function Stripe({onApprove}: {onApprove: any}) {
  const {cart, clearCart} = useCart();
  const {toast} = useToast();
  const {workspaceURL} = useWorkspace();
  const {searchParams} = useSearchParams();
  const validateRef = useRef(false);

  const handleCreateCheckoutSession = async () => {
    try {
      const result = await createStripeCheckoutSession({cart, workspaceURL});

      if (result.error) {
        toast({
          variant: 'destructive',
          title: result.message,
        });
      }

      const {url} = result;
      window.location.assign(url as string);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error processing stripe payment, try again.'),
      });
    }
  };

  const handleValidateStripePayment = useCallback(
    async ({stripeSessionId}: {stripeSessionId: string}) => {
      try {
        if (!stripeSessionId) {
          return;
        }

        const result = await validateStripePayment({
          stripeSessionId,
          cart,
          workspaceURL,
        });
        if (result.error) {
          toast({
            variant: 'destructive',
            title: result.message,
          });
        } else {
          toast({
            variant: 'success',
            title: i18n.get('Order requested successfully'),
          });

          clearCart();
          onApprove?.(result);
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: i18n.get('Error processing stripe payment, try again.'),
        });
      }
    },
    [toast, clearCart, onApprove, cart, workspaceURL],
  );

  useEffect(() => {
    if (validateRef.current) {
      return;
    }

    const stripeSessionId = searchParams.get('stripe_session_id');
    const stripeError = searchParams.get('stripe_error');

    if (stripeError) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error processing stripe payment, try again.'),
      });
    } else if (stripeSessionId) {
      handleValidateStripePayment({stripeSessionId});
    }
    validateRef.current = true;
  }, [searchParams, toast, handleValidateStripePayment]);

  return (
    <Button
      className="h-[50px] bg-[#635bff] text-lg font-medium"
      onClick={handleCreateCheckoutSession}>
      Pay with Stripe
    </Button>
  );
}

function Paypal({onApprove}: {onApprove: any}) {
  const {cart, clearCart} = useCart();
  const {toast} = useToast();
  const {workspaceURL} = useWorkspace();

  const handleCreatePaypalOrder = async (data: any, actions: any) => {
    const result: any = await paypalCreateOrder({cart, workspaceURL});

    if (result.error) {
      toast({
        variant: 'destructive',
        title: result.message,
      });
    } else {
      return result?.order?.id;
    }
  };

  const handleApprovePaypalOrder = async (data: any, actions: any) => {
    const result = await paypalCaptureOrder({
      orderId: data.orderID,
      workspaceURL,
      cart,
    });

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: result.message,
      });
    } else {
      toast({
        variant: 'success',
        title: i18n.get('Order requested successfully'),
      });

      clearCart();

      onApprove?.(result);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'EUR',
        intent: 'capture',
        disableFunding: 'card',
      }}>
      <PayPalButtons
        style={{
          color: 'blue',
          shape: 'rect',
          height: 50,
        }}
        createOrder={handleCreatePaypalOrder}
        onApprove={handleApprovePaypalOrder}
      />
    </PayPalScriptProvider>
  );
}

function Summary({cart}: any) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg">
      <Title
        className="text-xl font-semibold mb-6"
        text={i18n.get('Summary')}
      />
      <div className="flex flex-col gap-4 pt-4">
        {cart.items.map(
          ({
            computedProduct: {product, price} = {} as any,
            quantity,
            note,
            images,
          }: any = {}) => (
            <div key={product?.id} className="flex gap-4">
              <BackgroundImage
                src={getImageURL(images?.[0] ? images?.[0] : null)}
                className="rounded-lg w-[5rem] h-[5rem]"
              />
              <div>
                <Title
                  className="text-base font-medium line-clamp-1"
                  text={i18n.getValueAttribute(product?.name)}></Title>
                {note && (
                  <div>
                    {i18n.get('Note')} : {note}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">{i18n.get('Quantity')}</p>
                  <p className="border rounded px-4">{quantity}</p>
                </div>
                <Title
                  className="font-semibold"
                  text={price?.displayPrimary}></Title>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
function Total({cart, shippingType, workspace}: any) {
  const {
    total,
    displayTotal,
    scale: {currency: currencyScale},
    currency: {symbol: currencySymbol},
  } = computeTotal({cart, workspace});
  const shipping = Number(
    scale(SHIPPING_TYPE_COST[shippingType], currencyScale),
  ) as number;
  const totalWithShipping = Number(total) + Number(shipping);

  return (
    <div className="rounded-lg p-4 bg-card text-card-foreground">
      <Title className="text-xl font-semibold mb-6" text="Total" />
      <Separator className="my-4" />
      <div className="flex justify-between">
        <p>{i18n.get('Products')}:</p>
        <div>
          <p className="font-semibold text-right">{displayTotal}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p>{i18n.get('Shipping')}:</p>
        <div>
          <p className="text-xs">{`${shipping} ${currencySymbol}`}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <p className="font-medium font-m">{i18n.get('Total price')}:</p>
        <div>
          <p className="text-xl font-semibold">
            {`${totalWithShipping} ${currencySymbol}`}
          </p>
        </div>
      </div>
    </div>
  );
}
function Contact() {
  const [loading, setLoading] = useState(false);
  const [invoicingAddress, setInvoicingAddress] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);

  const {cart, updateAddress} = useCart();

  const {
    invoicingAddress: cartInvoicingAddress,
    deliveryAddress: cartDeliveryAddress,
  } = cart || {};

  const {workspaceURI} = useWorkspace();

  const handleFetchAddresses = useCallback(async () => {
    const [deliveryAddress, invoicingAddress] = await Promise.all([
      cartDeliveryAddress
        ? findAddress(cartDeliveryAddress)
        : findDeliveryAddress(),
      cartInvoicingAddress
        ? findAddress(cartInvoicingAddress)
        : findInvoicingAddress(),
    ]);

    if (invoicingAddress) {
      setInvoicingAddress(invoicingAddress);
      if (!cartInvoicingAddress) {
        updateAddress({addressType: 'invoicing', address: invoicingAddress.id});
      }
    }

    if (deliveryAddress) {
      setDeliveryAddress(deliveryAddress);
      if (!cartDeliveryAddress) {
        updateAddress({type: 'delivery', address: deliveryAddress.id});
      }
    }
  }, [cartInvoicingAddress, cartDeliveryAddress, updateAddress]);

  useEffect(() => {
    setLoading(true);
    handleFetchAddresses().finally(() => {
      setLoading(false);
    });
  }, [handleFetchAddresses]);

  const noaddress = !invoicingAddress && !deliveryAddress;

  const sameDeliveryAndInvoicingAddress =
    invoicingAddress &&
    deliveryAddress &&
    invoicingAddress.id === deliveryAddress.id;

  const LinkButton = ({children, ...props}: any) => (
    <Link href={`${workspaceURI}/account/addresses?checkout=true`}>
      <Button className="rounded-full" variant="outline" {...props}>
        {children}
      </Button>
    </Link>
  );

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg">
      <Title className="text-xl font-medium" text={i18n.get('Contact')} />
      <Separator className="my-4" />
      {loading ? (
        <Loader />
      ) : noaddress ? (
        <div className="border p-4 rounded-lg space-y-2">
          <Title
            className="text-lg font-semibold mb-4"
            text={i18n.get('Invoicing and delivery address')}
          />
          <LinkButton>{i18n.get('Create an address')}</LinkButton>
        </div>
      ) : sameDeliveryAndInvoicingAddress ? (
        <div className="border p-4 rounded-lg space-y-2">
          <Title
            className="text-lg font-semibold mb-4"
            text={i18n.get('Invoicing and delivery address')}
          />
          <div>
            <h5 className="font-bold text-xl">
              {deliveryAddress?.address?.addressl2}
            </h5>
            <h6>{deliveryAddress?.address?.addressl4}</h6>
            <h6>{deliveryAddress?.address?.addressl6}</h6>
            <h6>{deliveryAddress?.address?.country?.name}</h6>
          </div>
          <LinkButton>{i18n.get('Choose another address')}</LinkButton>
        </div>
      ) : (
        <div className="space-y-2 divide-y">
          {[
            {title: 'Delivery Address', address: deliveryAddress?.address},
            {title: 'Invoicing Address', address: invoicingAddress?.address},
          ].map(({title, address}) => (
            <div key={title} className="border p-4 rounded-lg space-y-2">
              <Title
                className="text-lg font-semibold mb-4"
                text={i18n.get(title)}
              />
              {address ? (
                <>
                  <div>
                    <h5 className="font-bold text-xl">{address.addressl2}</h5>
                    <h6>{address.addressl4}</h6>
                    <h6>{address.addressl6}</h6>
                    <h6>{address.country?.name}</h6>
                  </div>
                  <LinkButton>{i18n.get('Choose another address')}</LinkButton>
                </>
              ) : (
                <LinkButton variant="default">
                  {i18n.get('Create an address')}
                </LinkButton>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Shipping({value, onChange}: {value: string; onChange: any}) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg">
      <Title
        className="text-xl font-medium"
        text={i18n.get('Shipping Method')}
      />
      <Separator className="my-4" />
      <RadioGroup defaultValue={value}>
        <div className="border rounded-lg flex p-4 gap-4 items-center">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              name="shipping"
              value={SHIPPING_TYPE.REGULAR}
              className={`${styles.radio}`}
              onClick={onChange}
              id="r1"
            />
            <Label className="font-medium !ml-4" htmlFor="r1">
              {i18n.get('Regular Shipping')}{' '}
              <small className="text-xs font-medium ml-1">{`5-10 ${i18n.get(
                'Business Days',
              )}`}</small>
            </Label>
          </div>

          <Title className="text-xs font-medium ml-auto" text="2.00 €" />
        </div>

        <div className="border rounded-lg flex p-4 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              name="shipping"
              value={SHIPPING_TYPE.FAST}
              className={`${styles.radio}`}
              onClick={onChange}
              id="r2"
            />
            <Label className="font-medium !ml-4" htmlFor="r1">
              {i18n.get('Fast Shipping')}{' '}
              <small className="text-xs font-medium ml-1">{`2-3 ${i18n.get(
                'Business Days',
              )}`}</small>
            </Label>
          </div>

          <Title className="text-xs font-medium ml-auto" text="5.00 €" />
        </div>
      </RadioGroup>
    </div>
  );
}

function Title({text, ...rest}: {text: string} & any) {
  return (
    <h3 className="font-bold text-3xl" {...rest}>
      {text}
    </h3>
  );
}

export default function Content({
  workspace,
  orderSubapp,
}: {
  workspace: PortalWorkspace;
  orderSubapp?: any;
}) {
  const {data: session} = useSession();
  const user = session?.user;

  const [shippingType, setShippingType] = useState<string>(
    SHIPPING_TYPE.REGULAR,
  );

  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {cart} = useCart();
  const [computedProducts, setComputedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const openConfirmation = () => {
    setConfirmationDialog(true);
  };

  const closeConfirmation = () => {
    setConfirmationDialog(false);
  };

  const handleConfirmOrder = () => {
    closeConfirmation();
    router.replace(`${workspaceURI}/shop/cart/checkout/request-order`);
  };

  const handleChangeShippingType = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShippingType(event.target.value);
  };

  const redirectOrder = useCallback(
    (order: any) => {
      if (orderSubapp) {
        router.replace(
          `${workspaceURI}/${SUBAPP_CODES.orders}/${SUBAPP_PAGE.orders}/${order.data}`,
        );
      } else {
        router.replace(`${workspaceURI}/shop`);
      }
    },
    [workspaceURI, router, orderSubapp],
  );

  useEffect(() => {
    const init = async () => {
      if (!computedProducts?.length && cart) {
        await Promise.all(
          cart.items.map((i: any) =>
            findProduct({id: i.product, workspace: workspace, user}),
          ),
        )
          .then(computedProducts => {
            setComputedProducts(computedProducts);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };
    init();
  }, [cart, computedProducts, workspace, user]);

  const $cart = useMemo(
    () => ({
      ...cart,
      items: [
        ...cart?.items?.map((i: any) => ({
          ...i,
          computedProduct: computedProducts.find(
            cp => Number(cp?.product?.id) === Number(i.product),
          ),
        })),
      ],
    }),
    [cart, computedProducts],
  );

  if (loading) {
    return <p>{i18n.get('Loading')}...</p>;
  }

  return (
    <>
      <h4 className="mb-6 text-xl font-medium">{i18n.get('Confirm Cart')}</h4>
      <div className="grid lg:grid-cols-[1fr_25%] xl:grid-cols-[1fr_21%] grid-cols-1 gap-4">
        <div>
          <div className="flex flex-col gap-6">
            <Contact />
            <Shipping
              value={shippingType}
              onChange={handleChangeShippingType}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-6">
            <Summary cart={$cart} />
            <Total
              cart={$cart}
              shippingType={shippingType}
              workspace={workspace}
            />
            <div className="flex flex-col gap-2">
              <Paypal onApprove={redirectOrder} />
              <Stripe onApprove={redirectOrder} />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={Boolean(confirmationDialog)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.get('Do you want to confirm order?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.get('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOrder}>
              {i18n.get('Continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
