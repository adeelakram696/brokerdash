export const isPastDate = (date) => {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate < today;
};

export const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
