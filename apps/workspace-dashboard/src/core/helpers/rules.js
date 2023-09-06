export default {
  required: (value) => !!value || 'Required.',
  maxLength: (len) => (value) => value.length <= len || `Max ${len} characters`,
  minLength: (len) => (value) => value.length >= len || `Minimum ${len} characters`,
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Invalid e-mail.';
  },
};
