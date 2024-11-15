import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
// API READ ALL
productRouter.get("/", async (req, res) => {
  try {
    // เข้าถึง Collection "products"
    const collection = db.collection("products");

    // ดึงข้อมูลสินค้าทั้งหมดจาก MongoDB
    const products = await collection.find().toArray();

    // ส่งข้อมูลสินค้ากลับไปยัง Client
    return res.json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (e) {
    return res.status(500).json({ message: `fail to create order ${e}` });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    // ตรวจสอบว่า `id` เป็น ObjectId ที่ถูกต้อง
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // ดึงข้อมูลสินค้าจาก MongoDB
    const product = await collection.findOne({ _id: productId });

    // หากไม่พบสินค้า
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Product fetched successfully 1",
      data: product,
    });
  } catch (e) {
    return res.status(500).json({
      message: `Failed to fetch product ${e}`,
    });
  }
});

// API Route สำหรับสร้างหนังเรื่องใหม่ไว้ใน movieRouter
productRouter.post("/", async (req, res) => {
  try {
    // 2) เลือก Collection ที่ชื่อ `products`
    const collection = db.collection("products");

    // 3) เริ่ม Insert ข้อมูลลงใน Database โดยใช้ `collection.insertOne(query)`
    // นำข้อมูลที่ส่งมาใน Request Body ทั้งหมด Assign ใส่ลงไปใน Variable ที่ชื่อว่า `productData`
    const productData = { ...req.body };
    const productResult = await collection.insertOne(productData);
    // 4) Return ตัว Response กลับไปหา Client
    return res.json({
      message: "Product has been created successfully",
      productResult,
    });
  } catch (e) {
    return res.status(500).json({ message: `fail to create product ${e}` });
  }
});

// API Update Products
productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productId = new ObjectId(req.params.id);
    const newProduct = { ...req.body };

    const result = await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProduct,
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: `product ${productId} has been updated successfully`,
    });
  } catch (e) {
    return res.status(500).json({ message: `fail to update product ${e}` });
  }
});

// API Delete product
productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productID = new ObjectId(req.params.id);
    await collection.deleteOne({
      _id: productID,
    });

    return res.json({
      message: `remove productId(${productID} has been delete successfully)`,
    });
  } catch (e) {
    return res.status(500).json({ message: `fail to delete product ${e}` });
  }
});

export default productRouter;
