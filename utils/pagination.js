exports.paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const results = {};
    const filterParams = {};

    // Add search functionality
    if (req.query.search) {
      const searchQuery = req.query.search;
      filterParams.name = { $regex: searchQuery, $options: "i" };
    }

    // Product start
    if (req.query.priceRange) {
      const priceRange = req.query.priceRange.split("-");
      const minPrice = parseInt(priceRange[0]);
      const maxPrice = parseInt(priceRange[1]);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filterParams.price = {
          $gte: minPrice,
          $lte: maxPrice,
        };
      } else if (!isNaN(minPrice)) {
        if (minPrice === 5000) {
          filterParams.price = {
            $gte: minPrice,
          };
        } else {
          filterParams.price = {
            $eq: minPrice,
          };
        }
      }
    }

    // Product end

    // Orders start
    if (req.query.orderStatus) {
      filterParams.status = req.query.orderStatus;
    }

    if (req.query.startDate && req.query.endDate) {
      filterParams.createdAt = {
        $gte: req.query.startDate,
        $lte: req.query.endDate,
      };
    }

    if (req.query.orderId) {
      filterParams.orderID = req.query.orderId;
    }

    if (req.query.paymentMethod) {
      filterParams.paymentMethod = req.query.paymentMethod;
    }
    // orders end

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      let query = model.find(filterParams, { deleted: false });

      if (sortBy) {
        query = query.sort({ [sortBy]: sortOrder });
      }

      results.results = await query.limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};
