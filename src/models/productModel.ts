import { model, Schema } from "mongoose";
import slugify from "slugify";
import { IProduct } from "../types";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "نام محصول را وارد کنید"],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "توضیحات محصول را وارد کنید"],
    },

    image: {
      type: String,
      required: [true, "تصویر محصول را وارد کنید"],
    },
    images: {
      type: [String],
    },

    countInStock: {
      type: Number,
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    brand: {
      type: String,
      required: [true, "برند محصول را وارد کنید"],
    },
    category: {
      type: String,
      required: [true, "کتگوری محصول را وارد کنید"],
    },

    rating: {
      type: Number,
      default: 4.5,
    },
    numReviews: {
      type: Number,
      default: 1,
    },

    price: {
      type: Number,
      required: [true, "قیمت محصول را وارد کنید"],
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//////////// Virtual Property ////////////

productSchema.virtual("discountedPrice").get(function () {
  const defaultValue = 0;
  if (this.discount === defaultValue) return null;

  const discountMultiplier = 1 - this.discount / 100;
  return this.price * discountMultiplier;
});

//////////// Document Middleware ////////////

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = model<IProduct>("Product", productSchema);
export default Product;
