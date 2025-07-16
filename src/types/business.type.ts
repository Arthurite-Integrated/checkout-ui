import { type Address } from "./address.type";

export type Business = {
  id: string;
  name: string;
  email: string;
  address?: Address;
  image?: string;
}