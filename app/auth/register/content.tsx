'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import {FaGoogle} from 'react-icons/fa';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Button,
  Separator,
  TextField,
  StyledAlert,
  DatePicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/ui/components';
import {useToast} from '@/ui/hooks';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {register, subscribe} from './actions';

interface UserValues {
  firstName: string;
  name: string;
  email: string;
  birthdate: any;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Content({workspace}: {workspace?: PortalWorkspace}) {
  const [values, setValues] = useState<UserValues>({
    firstName: '',
    name: '',
    email: '',
    birthdate: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {data: session} = useSession();
  const user = session?.user;

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setValues(v => ({...v, [name]: value}));
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {toast} = useToast();

  const toggleShowPassword = () => setShowPassword(show => !show);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(show => !show);

  const handleCancel = () => {
    router.replace('/');
  };

  const handleSubscription = async () => {
    if (!workspace) return;
    setSubmitting(true);
    try {
      const res = await subscribe({workspace});

      if (res.error) {
        toast({
          variant: 'destructive',
          title: res.message,
        });
      } else if (res.success) {
        toast({
          variant: 'success',
          title: res.message,
        });
        router.replace(workspace.url);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error subscribing, try again'),
      });
    }

    setSubmitting(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const {password, confirmPassword} = values;

    setError('');

    if (password !== confirmPassword) {
      setError(i18n.get('Password and confirm password mismatch'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({...values, workspaceURL: workspace?.url});

      if (res.success) {
        toast({
          variant: 'success',
          title: res.message,
        });
        router.push(`/auth/login?${searchQuery}`);
      } else if (res.error) {
        toast({
          variant: 'destructive',
          title: res.message,
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error registering, try again'),
      });
    }
    setSubmitting(false);
  };

  if (user) {
    return (
      <Dialog open onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.get('Already an user')}</DialogTitle>
            <DialogDescription>
              {i18n.get(
                `You are already a user, do you want to subscribe to ${workspace?.url} ?`,
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {i18n.get('Cancel')}
            </Button>
            <Button type="button" onClick={handleSubscription}>
              {i18n.get('Subscribe')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-[74.0625rem] w-full">
      <h5 className="mb-3 font-medium text-xl">{i18n.get('Sign Up')}</h5>
      <form
        className="bg-card text-card-foreground rounded-lg py-4 px-6 sm:px-4 grid grid-cols-1 gap-4"
        onSubmit={handleSubmit}>
        <div>
          <TextField
            label={i18n.get('First Name')}
            name="firstName"
            value={values.firstName}
            disabled={submitting}
            onChange={handleChange}
            placeholder="Enter first name"
          />
          <TextField
            label={i18n.get('Last Name')}
            name="name"
            value={values.name}
            disabled={submitting}
            onChange={handleChange}
            placeholder="Enter last name"
            required
          />
          <TextField
            label={i18n.get('Email')}
            name="email"
            value={values.email}
            disabled={submitting}
            onChange={handleChange}
            type="email"
            placeholder="Enter email"
            required
          />
          {false && (
            <>
              <TextField
                label={i18n.get('Phone')}
                name="phone"
                value={values.phone}
                disabled={submitting}
                onChange={handleChange}
                type="number"
                placeholder="Enter phone"
              />
              <label className="font-medium text-card-foreground mb-1">
                {i18n.get('Birthdate')}
              </label>
              <DatePicker
                value={values.birthdate}
                onChange={(date: Date) => {
                  setValues({
                    ...values,
                    birthdate: date,
                  });
                }}
              />
            </>
          )}
          <TextField
            label={i18n.get('Password')}
            name="password"
            value={values.password}
            disabled={submitting}
            onChange={handleChange}
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            icons={[
              {
                icon: showPassword
                  ? 'MdOutlineVisibility'
                  : 'MdOutlineVisibilityOff',
                onClick: toggleShowPassword,
              },
            ]}
            required
          />
          <TextField
            label={i18n.get('Confirm Password')}
            name="confirmPassword"
            value={values.confirmPassword}
            disabled={submitting}
            onChange={handleChange}
            placeholder="Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icons={[
              {
                icon: showConfirmPassword ? 'visibility_off' : 'visibility',
                onClick: toggleShowConfirmPassword,
              },
            ]}
            required
          />
          <Button type="submit" className="rounded-full w-full">
            {i18n.get('Sign Up')}
          </Button>
        </div>
        <div>
          <p className="text-card-foreground inline-flex text-lg mr-2 mb-0">
            {i18n.get('Already have an account')} ?
          </p>
          <Link
            href={`/auth/login?${searchQuery}`}
            className="text-palette-purple-dark inline-flex text-decoration-underline text-lg">
            {i18n.get('Log In')}
          </Link>
        </div>
        {error && <StyledAlert variant="error" show={true} heading={error} />}
      </form>
      <div className="hidden items-center gap-4 mt-4">
        <div className="grow">
          <Separator />
        </div>
        <h5 className="mb-0 font-medium text-xl">{i18n.get('Or')}</h5>
        <div className="grow">
          <Separator />
        </div>
      </div>
      <div className="mt-4 hidden">
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-4 rounded-full w-full !border-primary !bg-primary-foreground">
          <FaGoogle className="text-xl" />
          <span className="text-primary font-medium">
            {i18n.get('Create an account with Google')}
          </span>
        </Button>
      </div>
    </div>
  );
}
