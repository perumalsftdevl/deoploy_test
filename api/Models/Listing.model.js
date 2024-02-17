import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathRooms: {
      type: Number,
      required: true,
    },
    bedRooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      require: true,
    },
    parking: {
      type: Boolean,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    offer: {
      type: Boolean,
      require: true,
    },
    // imagesUrls: {
    //   type: [
    //     {
    //       place_name: {
    //         type: String,
    //         required: true,
    //       },
    //       url: {
    //         type: String,
    //         required: true,
    //       },
    //     },
    //   ],
    imagesUrls: [],
    // validate: [
    //   {
    //     validator: function (value) {
    //       const placeNames = new Set();
    //       for (const entry of value) {
    //         if (placeNames.has(entry.place_name)) {
    //           return false; // Duplicate found
    //         }

    //         placeNames.add(entry.place_name);
    //       }

    //       return true; // No duplicates found
    //     },
    //     message: "Duplicate place_name found in imagesUrls array",
    //   },
    // ],
    //required: true,
    //},

    UserRef: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

ListSchema.index({ name: 1 });
const ListingModel = mongoose.model("Listing", ListSchema);
export default ListingModel;
