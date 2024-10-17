export const capitalizeFirstLetter = (string) => {
  if (typeof string !== 'string') {
    return ''; // or throw an error, log a message, etc.
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

