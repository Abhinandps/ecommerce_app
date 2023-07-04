const cron = require("node-cron");
const Banner = require("../Models/banner");
const ProductOffer = require("../Models/productOffer");

const updateBannerStatus = async () => {
  try {
    const banners = await Banner.find();

    for (const banner of banners) {
      if (banner.endDate) {
        const endDate = new Date(banner.endDate);
        if (endDate < new Date()) {
          banner.status = "inactive";
          await banner.save();
        }
      }
    }
    console.log("Banner status update cron job completed");
  } catch (error) {
    console.error("Error updating banner statuses:", error);
  }
};

exports.paginatedResults = (model) => {
  // updated every 00:00
  cron.schedule("0 0 * * *", updateBannerStatus);

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


exports.paginatedResultsUser = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filterOptions = { deleted: false };

    if (req.query.category) {
      filterOptions.category = req.query.category;
    }

    // Add search functionality
    if (req.query.search) {
      const searchQuery = req.query.search;
      filterOptions.name = { $regex: searchQuery, $options: "i" };
    }

     // Add price range filter
     if (req.query.minPrice && req.query.maxPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      const maxPrice = parseFloat(req.query.maxPrice);
      filterOptions.price = { $gte: minPrice, $lte: maxPrice };
    }

   

    try {
      const results = {};
      results.results = await model
        .find(filterOptions)
        .skip(startIndex)
        .limit(limit)
        .populate("category");

      if (endIndex < (await model.countDocuments(filterOptions).exec())) {
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

      // Retrieve the productOffer values and attach them to the products
      const productIds = results.results.map((product) => product._id);
      const productOffers = await ProductOffer.find({
        product: { $in: productIds },
      });

      results.resultsWithOffers = results.results.map((product) => {
        const offer = productOffers.find(
          (offer) => offer.product.toString() === product._id.toString()
        );
        return {
          ...product._doc,
          offer: offer ? offer.description : null,
        };
      });

      const paginatedResults = {
        results: results.resultsWithOffers,
        pagination: {
          total: await model.countDocuments(filterOptions).exec(),
          totalPages: Math.ceil(
            (await model.countDocuments(filterOptions).exec()) / limit
          ),
          page: page,
        },
        next: results.next,
        previous: results.previous,
      };
      res.paginatedUserResults = paginatedResults;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

