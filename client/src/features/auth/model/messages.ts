import { defineMessages } from 'react-intl'

export const authMessages = defineMessages({
  dividerOr: {
    id: 'auth.divider.or',
    defaultMessage: 'or',
  },
  emailLabel: {
    id: 'auth.email.label',
    defaultMessage: 'Email',
  },
  passwordLabel: {
    id: 'auth.password.label',
    defaultMessage: 'Password',
  },
  passwordShow: {
    id: 'auth.password.show',
    defaultMessage: 'Show password',
  },
  passwordHide: {
    id: 'auth.password.hide',
    defaultMessage: 'Hide password',
  },
  loginForgotPassword: {
    id: 'auth.login.forgotPassword',
    defaultMessage: 'Forgot password?',
  },
  loginSubmit: {
    id: 'auth.login.submit',
    defaultMessage: 'Sign in',
  },
  loginErrorTitle: {
    id: 'auth.login.errorTitle',
    defaultMessage: "Couldn't sign in",
  },
  registerFullName: {
    id: 'auth.register.fullName',
    defaultMessage: 'Full name',
  },
  registerFullNamePlaceholder: {
    id: 'auth.register.fullNamePlaceholder',
    defaultMessage: 'Jane Doe',
  },
  registerConfirmPassword: {
    id: 'auth.register.confirmPassword',
    defaultMessage: 'Confirm password',
  },
  registerSubmit: {
    id: 'auth.register.submit',
    defaultMessage: 'Create account',
  },
  registerErrorTitle: {
    id: 'auth.register.errorTitle',
    defaultMessage: "Couldn't create account",
  },
  resetSubmit: {
    id: 'auth.reset.submit',
    defaultMessage: 'Send link',
  },
  validationEmailInvalid: {
    id: 'auth.validation.emailInvalid',
    defaultMessage: 'Enter a valid email address',
  },
  validationPasswordRequired: {
    id: 'auth.validation.passwordRequired',
    defaultMessage: 'Enter your password',
  },
  validationNameRequired: {
    id: 'auth.validation.nameRequired',
    defaultMessage: 'Enter your name',
  },
  validationNameMax: {
    id: 'auth.validation.nameMax',
    defaultMessage: 'Name must be 100 characters or fewer',
  },
  validationPasswordMin: {
    id: 'auth.validation.passwordMin',
    defaultMessage: 'Password must be at least 8 characters',
  },
  validationPasswordMax: {
    id: 'auth.validation.passwordMax',
    defaultMessage: 'Password must be 128 characters or fewer',
  },
  validationPasswordLetter: {
    id: 'auth.validation.passwordLetter',
    defaultMessage: 'Password must contain at least one letter',
  },
  validationPasswordDigit: {
    id: 'auth.validation.passwordDigit',
    defaultMessage: 'Password must contain at least one digit',
  },
  validationPasswordMismatch: {
    id: 'auth.validation.passwordMismatch',
    defaultMessage: 'Passwords do not match',
  },
  errorDefault: {
    id: 'auth.error.default',
    defaultMessage: 'Something went wrong. Please try again.',
  },
  errorSessionExpired: {
    id: 'auth.error.sessionExpired',
    defaultMessage: 'Your session has expired. Refresh the page and try again.',
  },
  errorInvalidCredentials: {
    id: 'auth.error.invalidCredentials',
    defaultMessage: 'Incorrect email or password',
  },
  errorTooManyAttempts: {
    id: 'auth.error.tooManyAttempts',
    defaultMessage: 'Too many attempts. Please try again later.',
  },
  errorValidation: {
    id: 'auth.error.validation',
    defaultMessage: 'Please check the highlighted fields',
  },
  errorEmailConflict: {
    id: 'auth.error.emailConflict',
    defaultMessage: 'This email is already registered',
  },
})
