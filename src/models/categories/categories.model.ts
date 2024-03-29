import { model } from "mongoose";
import { CategoryDoc } from "@/types/db";
import { CategorySchema } from "./categories.schema";

export const CategoryModel = model<CategoryDoc>("Category", CategorySchema);
