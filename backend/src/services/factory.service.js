import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import APIFeatures from "../utils/features.js";
import { sendResponse } from "../utils/ApiResponse.js";

/**
 * Generic controller factory implementing consistent CRUD handlers with
 * filtering, searching, sorting and pagination. Individual resource
 * controllers compose these to stay DRY while retaining escape hatches
 * via the `options` argument.
 *
 * @param {import('mongoose').Model} Model
 * @param {object} [options]
 * @param {string[]} [options.searchFields] - fields included in ?search=
 * @param {string} [options.entity] - human label used in messages
 * @param {object} [options.publicFilter] - filter forced for public reads
 * @param {string} [options.populate] - space-separated populate paths
 */
export const createFactory = (Model, options = {}) => {
  const {
    searchFields = [],
    entity = Model.modelName,
    populate = "",
  } = options;

  const getAll = catchAsync(async (req, res) => {
    const baseFilter = req.baseFilter || {};
    const features = new APIFeatures(Model.find(baseFilter), req.query)
      .search(searchFields)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (populate) features.query = features.query.populate(populate);

    // Total count respects the same filter (minus pagination) for accurate meta.
    const countFeatures = new APIFeatures(Model.find(baseFilter), req.query)
      .search(searchFields)
      .filter();
    const [docs, total] = await Promise.all([
      features.query,
      Model.countDocuments(countFeatures.query.getFilter()),
    ]);

    sendResponse(res, 200, docs, `${entity} list fetched`, features.buildMeta(total));
  });

  const getOne = catchAsync(async (req, res) => {
    const { id } = req.params;
    const query = /^[0-9a-fA-F]{24}$/.test(id)
      ? Model.findById(id)
      : Model.findOne({ slug: id });
    if (populate) query.populate(populate);
    const doc = await query;
    if (!doc) throw ApiError.notFound(`${entity} not found`);
    sendResponse(res, 200, doc, `${entity} fetched`);
  });

  const createOne = catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    sendResponse(res, 201, doc, `${entity} created`);
  });

  const updateOne = catchAsync(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw ApiError.notFound(`${entity} not found`);
    Object.assign(doc, req.body);
    await doc.save(); // save() so pre-save hooks (slug, hashing) run
    sendResponse(res, 200, doc, `${entity} updated`);
  });

  const deleteOne = catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw ApiError.notFound(`${entity} not found`);
    sendResponse(res, 200, { id: req.params.id }, `${entity} deleted`);
  });

  return { getAll, getOne, createOne, updateOne, deleteOne };
};

export default createFactory;
