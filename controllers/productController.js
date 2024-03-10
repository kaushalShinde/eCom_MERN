import productModel from "./../models/productModel.js";
import categoryModel from "./../models/categoryModel.js";
import orderModel from "./../models/orderModel.js";
import slug from "slugify";
import slugify from "slugify";
import fs from "fs";

import dotenv from 'dotenv';

import braintree from 'braintree';

// dotenv config
dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

// const gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox, // or Production
//   merchantId: 'your_merchant_id',
//   publicKey: 'your_public_key',
//   privateKey: 'your_private_key'
// });


export const createProductController = async (req, res) => {
  try {
    // console.log("product-create");
    // console.log(req.fields)

    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    console.log(req.files);

    // validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(500).send({
        success: false,
        message: "Insufficient Data",
      });
    }

    // if sent category is the name
    // Find category by name
    // const categoryId = await categoryModel.findOne({ name: category });
    // if (!categoryId) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Category not found',
    //     });
    // }

    // console.log(categoryObject);

    // if (photo.size > 1000000) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Image should be less than 1MB",
    //   });
    // }

    // const slugName = slugify(name);
    const products = new productModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    // console.log(products.photo.data);
    console.log(products.photo.contentType);
    await products.save();

    // console.log('product created');
    // console.log(products)

    res.status(200).send({
      success: true,
      productId: products._id,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Creating Product",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    // can add .limit(12) before .sort()
    let products = await productModel
      .find({})
      .select("-photo")
      .sort({ createdAt: -1 });

    //   .populate("category")

    // const categoryName =  await categoryModel.findOne({_id: products.category});
    // console.log(categoryName)s;

    res.status(200).send({
      success: true,
      message: "All Products",
      totalCount: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Getting Products",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;

    let product = await productModel.findOne({ slug }).select("-photo");
    const categoryName = await categoryModel.findOne({ _id: product.category });
    
    // console.log(product);
    // product.category.name = (categoryName.name);
    // console.log(product);

    res.status(200).send({
      success: true,
      message: "single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Fetching Single Product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    ////console.log("product-photo");

    //console.log(req.params.pid);
    const product = await productModel.findById(req.params.pid).select("photo");

    let productPhotoData = product.photo.data;
    if (productPhotoData) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(productPhotoData);
    }
    res.status(201).send({
      message: "Image might not get",
      res,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Getting Photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    //console.log("delete-product");
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");

    res.status(200).send({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Getting Photo",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    //console.log("updating-product");
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(500).send({
        success: false,
        message: "Insufficient Data",
      });
    }

    // if sent category is the name
    // Find category by name
    // const categoryId = await categoryModel.findOne({ name: category });
    // if (!categoryId) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Category not found',
    //     });
    // }

    // console.log(categoryObject);

    // if (photo.size > 1000000) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Image should be less than 1MB",
    //   });
    // }

    // const slugName = slugify(name);
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    //console.log(products.name);
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Updating Product",
      error,
    });
  }
};

export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Filtering Product",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Counting Product",
      error,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in per page count",
      error,
    });
  }
};



// search product
export const searchProductController = async (req, res) => {
  try{

    const { keyword } = req.params;
    const result = await productModel.find({
      $or: [
        {name: { $regex: keyword, $options: 'i'}},
        {description: { $regex: keyword, $options: 'i'}},
      ]
    }).select('-photo');
    res.json(result);
  }
  catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Searching Products",
      error,
    });
  }
};


export const relatedProductController = async (req, res) => {
  try{
    const {pid, cid} = req.params

    const products = await productModel.find({
      category: cid,
      _id: {$ne: pid}
    }).select('-photo').populate('category')

    res.status(200).send({
      success: true,
      message: "Got Related Products",
      products
    })
  }
  catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Getting Related Products",
      error,
    });
  }

}


// get product by category
export const productCategoryController = async (req, res) => {
  try{

    const category = await categoryModel.findOne({slug: req.params.slug});
    const products = await productModel.find({category}).select('-photo');
    // .populate('category')

    res.status(200).send({
      success: true,
      category,
      products,
    })

  }
  catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Getting Category Products",
      error,
    });
  }
};




// payment gateway api

// token
export const braintreeTokenController = async (req, res) => {
  try{
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      }
      res.send(response);
    });
  }
  catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Getting Payment Token",
      error,
    });
  }
};

// // payment
// export const braintreePaymentController = async (req, res) => {
//   try{
//     const { cart, nonce } = req.body;
//     let total = 0;
//     cart.map( (item) => {total = total + item.price});

//     // creating new transaction
//     let newTransaction = gateway.transaction.sale({
//       amount: total,
//       paymentMethodNonce: nonce,
//       options: {
//         submitForSettlement: true,
//       }
//     },
//     async function (error, result) {
//       if(result){
//         const order = await new orderModel({
//           products: cart,
//           payment: result,
//           buyer: req.user._id,
//         }).save();

//         res.json({ok: true});
//       }
//       else{
//         res.status(500).send(error);
//       }
//     }
//     )

//   }
//   catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error Doing Payment",
//       error,
//     });
//   }

// };


//payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });

    // console.log('*******thi is in product contolelr payment contoller');
    // console.log(req.user._id);

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        //console.log('this is result from brain tree payment controler')
        //console.log(result);
        if (result) {
          const order = orderModel.create({
            products: cart,
            payment: result,
            buyers: req.user._id,
          })
          // .save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};