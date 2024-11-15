import { Router } from "express";

import { db } from "../utils/db.js";

import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find({}).toArray();
    return res.json({
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const product = await collection.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        message: `Product with ID ${req.params.id} not found`,
      });
    }
    return res.json({
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body };
  await collection.insertOne(productData);
  return res.json({
    message: "Product has been created successfully",
  });
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const productData = { ...req.body };
  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: productData,
    }
  );
  return res.json({
    message: "Product has been updated successfully",
  });
});

// chat
/* productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productsId = new ObjectId(req.params.id);
    const newProductsdata = { ...req.body };
    const result = await collection.updateOne(
      { _id: productsId },
      { $set: newProductsdata }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Product has been updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to update product ${error.message}` });
  }
}); */

productRouter.delete("/:productId", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.productId);

  await collection.deleteOne({
    _id: productId,
  });

  return res.json({
    message: "Product has been deleted successfully",
  });
});

export default productRouter;
