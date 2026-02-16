let performanceReviews = [];

export const savePerformanceReview = (review) => {
  performanceReviews.push(review);
  return review;
};

export const getPerformanceByEmployee = (employeeId) => {
  return performanceReviews.filter(r => r.employeeId === employeeId);
};

export const getAllPerformanceReviews = () => {
  return performanceReviews;
};
