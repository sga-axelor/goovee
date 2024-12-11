export const LIMIT = 7;

export const PORTAL_PARTICIPANT_MODEL =
  'com.axelor.apps.portal.db.PortalParticipant';

export const CONTACT_ATTRS = 'contactAttrs';
export const SUCCESS_REGISTER_MESSAGE =
  'You have been successfully registered to this event.';
export const CATEGORIES = 'Categories';

export const EDIT_MY_REGISTRATION = 'Edit my registration';
export const REGISTER_TO_EVENT = 'Register to the event';
export const REGISTER_TAG = '#Registered';

export const EVENTS_NAVBAR_LINKS = [
  {
    id: 1,
    title: 'Events',
    redirectTo: '/',
    validate: false,
  },
  {
    id: 2,
    title: 'My registrations',
    redirectTo: '/my-registration',
    validate: true,
  },
];
