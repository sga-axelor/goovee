export const focusInputMessage = () => {
  window.dispatchEvent(new Event('focus-input-message'));
};
