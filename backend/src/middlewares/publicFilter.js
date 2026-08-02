/**
 * Force a base filter for unauthenticated (public) reads so drafts/archived
 * content never leak. Admin routes skip this and can query any status.
 * @param {object} filter - Mongoose filter merged into the query.
 */
export const publicFilter = (filter) => (req, res, next) => {
  req.baseFilter = { ...(req.baseFilter || {}), ...filter };
  next();
};

export default publicFilter;
