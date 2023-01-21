import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { OrderModel } from "models/orders/orders.model";
import { ProductModel } from "models/products/products.model";
import { Product, Order } from "types/db";
// import { ObjectId } from "mongoose";

export const addOrder = async (req: Request, res: Response) => {
  const { products, user }: Order = req.body;

  try {
    const orderOwner = await UserModel.findOne({ user });

    if (!orderOwner) {
      res.status(404).json({ success: false, message: "No user found" });
      return;
    }

    let orderTotal = 0;

    for (const i in products) {
      const productId = products[i].product;
      const qty = products[i].quantity;
      const product: Product | null = await ProductModel.findOne({
        _id: productId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      if (product && product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} does not have enough stock`,
        });
      }

      if (product) {
        orderTotal += product.price;
        product.updateOne({ stock: product.stock - qty });

        await product.save();
      }
    }

    // if (orderTotal !== total) {
    // 	res.status(400).json({
    // 		message: `Order total is not correct`,
    // 	});
    // 	return false;
    // }

    const newOrder = await OrderModel.create({
      user,
      products,
      total: orderTotal,
      ...req.body,
    });

    // add order to user document
    await orderOwner.updateOne({ $push: { orders: newOrder.id } });
    await newOrder.save();

    res.status(200).json({
      success: true,
      data: newOrder,
      message: "Order added successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};
