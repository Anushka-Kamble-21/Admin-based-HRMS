export const getSandwichDays = (date) => {
  const day = new Date(date).getDay();
  const sandwich = [];

  if (day === 6) sandwich.push("Sunday");
  if (day === 1) sandwich.push("Tuesday");

  return sandwich;
};
