


exports.paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const results = {}
    const filterParams = {};

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

    

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      let query = model.find(filterParams);

      if (sortBy) {
        query = query.sort({ [sortBy]: sortOrder });
      }

      results.results = await query.limit(limit).skip(startIndex).exec();
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}