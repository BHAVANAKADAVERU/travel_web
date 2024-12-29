import Tour from '../models/Tour.js';

// Allowed categories for tours
const allowedCategories = ["Beach", "Adventure", "Cultural", "City", "Nature"];

// Create new tour
export const createTour = async (req, res) => {
    const { category } = req.body;

    // Validate category
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            success: false,
            message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
        });
    }

    const newTour = new Tour(req.body);

    try {
        const savedTour = await newTour.save();

        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedTour,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
};

// Update tour
export const updateTour = async (req, res) => {
    const id = req.params.id;
    const { category } = req.body;

    // Validate category if provided
    if (category && !allowedCategories.includes(category)) {
        return res.status(400).json({
            success: false,
            message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
        });
    }

    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedTour,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update',
        });
    }
};

// Get tours by category
export const getToursByCategory = async (req, res) => {
    const { category } = req.query;

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            success: false,
            message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
        });
    }

    try {
        const tours = await Tour.find({ category }).populate('reviews');

        res.status(200).json({
            success: true,
            message: 'Successfully found tours',
            data: tours,
        });

    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'No tours found for the given category',
        });
    }
};


//delete tour
export const deleteTour = async(req,res)=>{
    const id = req.params.id
   
    try {

        await Tour.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:'Successfully deleted',
           
        });
        
    } catch (err) {
        res.status(500).json({
            success:false,
            message:'Failed to delete',
        });
    }
}

//getSingle tour
export const getSingleTour = async(req,res)=>{
    const id = req.params.id
   
    try {

        const tour = await Tour.findById(id).populate('reviews')

        res.status(200).json({
            success:true,
            message:'Successfully find',
            data:tour
        });
        
    } catch (err) {
        res.status(404).json({
            success:false,
            message:'not found',
        });
    }
}

//getAll tour
export const getAllTour = async(req,res)=>{

    // for pagination
    const page = parseInt(req.query.page);

    try {
        
        const tours = await Tour.find({}).populate('reviews')
        .skip(page *8).limit(8)

        res.status(200).json({
            success:true,
            count:tours.length,
            message:'Successfully find all',
            data:tours
        })

    } catch (err) {
        res.status(404).json({
            success:false,
            message:'no data found',
        });

    }
    
}


export const getTourBySearch = async (req, res) => {
        // Extract query parameters from the request
        const { city, distance, maxGroupSize, priceRange, tourType } = req.query;
    
        // Initialize filter object
        let filter = {};
    
        // Location - city filter (case-insensitive search)
        if (city) {
            filter.city = new RegExp(city, 'i');
        }
    
        // Distance - filter by distance (greater than or equal to specified distance)
        if (distance) {
            const distanceInt = parseInt(distance);
            if (!isNaN(distanceInt)) {
                filter.distance = { $gte: distanceInt };
            }
        }
    
        // Max People - filter by maxGroupSize (greater than or equal to specified maxGroupSize)
        if (maxGroupSize) {
            const maxGroupSizeInt = parseInt(maxGroupSize);
            if (!isNaN(maxGroupSizeInt)) {
                filter.maxGroupSize = { $gte: maxGroupSizeInt };
            }
        }
    
        // Price Range - filter by price (assuming it's in the format "$0 - $1000")
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(price => parseInt(price.replace('$', '').trim()));
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                filter.price = { $gte: minPrice, $lte: maxPrice };
            }
        }
    
        // Tour Type - filter by tour type
        if (tourType && allowedCategories.includes(tourType)) {
            filter.category = tourType;
        }
    
        try {
            // Query the database with the constructed filter
            const tours = await Tour.find(filter).populate('reviews');
    
            if (tours.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Successfully found tours',
                    data: tours,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No results found for your search criteria',
                    data: tours,
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error occurred while searching for tours',
                error: err.message,
            });
        }
};
    


//get featured tour
export const getFeaturedTour = async(req,res)=>{


    try {
        
        const tours = await Tour.find({featured:true}).populate('reviews').limit(8)

        res.status(200).json({
            success:true,
            message:'Successfully find all',
            data:tours
        })

    } catch (err) {
        res.status(404).json({
            success:false,
            message:'no data found',
        });

    }
    
}

    //get tour counts
export const getTourCount = async(req,res)=>{
        try {
            const tourCount = await Tour.estimatedDocumentCount()

    
            res.status(200).json({success:true, data:tourCount});
        } catch (err) {
            res.status(200).json({success:true, message:"failed to featch"}) 
        }
}