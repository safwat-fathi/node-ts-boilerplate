import { NextFunction, Request, Response } from "express";
import { Product, Service } from "@/types/db";
import { HttpError } from "@/lib/classes/errors/http";
import { asyncHandler } from "@/api/middlewares/async.middleware";
import { ProductService } from "@/services/products.service";
import { CategoryService } from "@/services/categories.service";
import { redisClient } from "@/config/redis.config";

const productService = new ProductService();
const categoryService = new CategoryService();

// * Index
// * ----------
export const index = asyncHandler(async (_, res: Response) => {
  const data = await productService.index();

  return res.status(200).json({
    success: true,
    data,
  });
  // return new HttpError(401, res.__("unauthorized"));
  // return res.status(401).json({
  //   success: false,
  // });
});

// * Index with pagination
// * ----------
export const indexPaginated = asyncHandler(async (_, res: Response) => {
  return res.status(200).json({
    success: true,
    data: res.locals.dataPaginated.data,
    meta: res.locals.dataPaginated.meta,
    links: res.locals.dataPaginated.links,
  });
});

// * GET
// * ----------
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const data = await redisClient.get(slug);

    if (data !== null) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(data),
      });
    }

    const product = await productService.find({ slug });

    if (!product) {
      return next(
        new HttpError(404, res.__("no-product-match", { product: slug }))
      );
    }

    await redisClient.set(slug, JSON.stringify(product));

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

// * CREATE
// * ----------
export const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = req.body as Product;

    const categoriesFound = categoryService.find({ name: { $in: categories } });
    // const categoriesFound, count] = await categoryService.index(
    //   null,
    //   null,
    //   null,
    //   {
    //     _id: { $in: categories },
    //   }
    // );

    if (!categoriesFound) {
      return next(new HttpError(429, `No categories match ${categories}`));
    }

    const newProduct = await productService.create(req.body);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  }
);
