import { Product, TDoc } from "@/types/db";
import { BaseRepository } from "./base.repository";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { ProductsSchema } from "@/models/products/products.schema";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super("Product", ProductsSchema);
  }

  protected async find(
    query: FilterQuery<TDoc<Product>>,
    projection?: ProjectionType<Product> | null,
    options?: QueryOptions<TDoc<Product>>
  ): Promise<TDoc<Product>[]> {
    try {
      const products = await this._model.find(query, projection, options);

      return products;
    } catch (err) {
      throw err;
    }
  }

  protected async findOne(
    query: FilterQuery<TDoc<Product>>
  ): Promise<TDoc<Product> | null> {
    try {
      const product = await this._model.findOne(query).select("+images");

      return product;
    } catch (err) {
      throw err;
    }
  }

  protected async findById(id: string) {
    try {
      const product = await this._model.findById(id).select("+images");

      return product;
    } catch (err) {
      throw err;
    }
  }

  protected async update(id: string, data: Product) {
    try {
      const product = await this._model.findByIdAndUpdate(id, data, {
        new: true,
      });

      return product;
    } catch (err) {
      throw err;
    }
  }

  protected async addMany(products: Product[]) {
    try {
      const newProducts = await this._model.insertMany(products);

      return newProducts;
    } catch (err) {
      throw err;
    }
  }
}