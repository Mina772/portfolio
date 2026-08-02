/**
 * Reusable query builder implementing filtering, searching, sorting,
 * field limiting and pagination on top of a Mongoose query.
 *
 * @example
 *   const features = new APIFeatures(Project.find(), req.query)
 *     .search(["title", "description"])
 *     .filter()
 *     .sort()
 *     .limitFields()
 *     .paginate();
 *   const docs = await features.query;
 */
export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString || {};
    this._page = 1;
    this._limit = 12;
  }

  /** Full-text-ish OR regex search across provided fields via ?search= */
  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search.trim(), "i");
      this.query = this.query.find({
        $or: fields.map((f) => ({ [f]: regex })),
      });
    }
    return this;
  }

  /** Advanced filtering with gte/gt/lte/lt operators and comma lists. */
  filter() {
    const queryObj = { ...this.queryString };
    ["page", "sort", "limit", "fields", "search"].forEach((k) => delete queryObj[k]);

    // Support comma separated multi-value filters e.g. ?category=web,mobile
    Object.keys(queryObj).forEach((k) => {
      if (typeof queryObj[k] === "string" && queryObj[k].includes(",")) {
        queryObj[k] = { $in: queryObj[k].split(",") };
      }
    });

    let str = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt|ne|in)\b/g,
      (m) => `$${m}`
    );
    this.query = this.query.find(JSON.parse(str));
    return this;
  }

  /** Sorting via ?sort=field,-field. Defaults to newest first. */
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /** Sparse field selection via ?fields=title,slug */
  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(this.queryString.fields.split(",").join(" "));
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  /** Offset pagination via ?page= & ?limit= */
  paginate() {
    this._page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    this._limit = Math.min(Math.max(parseInt(this.queryString.limit, 10) || 12, 1), 100);
    const skip = (this._page - 1) * this._limit;
    this.query = this.query.skip(skip).limit(this._limit);
    return this;
  }

  /** Build pagination metadata given a total count. */
  buildMeta(total) {
    const totalPages = Math.ceil(total / this._limit) || 1;
    return {
      total,
      page: this._page,
      limit: this._limit,
      totalPages,
      hasNextPage: this._page < totalPages,
      hasPrevPage: this._page > 1,
    };
  }
}
