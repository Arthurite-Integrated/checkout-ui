import { MastraClient } from "@mastra/client-js";
import env from "../config/env";
import axios from "axios";
import api from "../utils/axios";
import type { Product } from "../types/Product";
import type { Business } from "../types/business.type";

class Server {
  private url = env.VITE_SERVER_URL as string;
  private agent_name = env.VITE_AGENT as string;
  private client = new MastraClient({
    baseUrl: this.url as string,
  });
  private agent = this.client.getAgent(this.agent_name);

  async chatAgent(input: string) {
    const { text } = await this.agent.generate({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      threadId: "thread-1",
      resourceId: "resource-1",
    });
    console.log(text);
    return text;
  }

  async getUserCarts(business_id: string) {
    try {
      const res = await api({
        method: "get",
        url: `/admin/carts/${business_id}`,
      });
      console.log(res)
      return res.data.data;
    } catch (e: any) {
      console.log(e.response)
      console.log(e.response.data.message);
      throw new Error("Error fetching carts");
    }
  }

  async getOrders(business_id: string) {
    try {
      const res = await api({
        method: "get",
        url: `/admin/orders/${business_id}`,
      });
      console.log(res)
      return res.data.data;
    } catch (e: any) {
      console.log(e.response)
      console.log(e.response.data.message);
      throw new Error("Error fetching users");
    }
  }

  async getUsers(business_id: string) {
    try {
      const res = await api({
        method: "get",
        url: `/admin/users/${business_id}`,
      });
      console.log(res)
      return res.data.data;
    } catch (e: any) {
      console.log(e.response)
      console.log(e.response.data.message);
      throw new Error("Error fetching users");
    }
  }
  
  async getPayments(business_id: string) {
    try {
      const res = await api({
        method: "get",
        url: `/admin/payments/${business_id}`,
      });
      console.log(res)
      return res.data.data;
    } catch (e: any) {
      console.log(e.response)
      console.log(e.response.data.message);
      throw new Error("Error fetching users");
    }
  }

  async getProducts(business_id: string) {
    try {
      const res = await api({
        method: "get",
        url: `/admin/products/${business_id}`,
      });
      console.log(res)
      return res.data.data;
    } catch (e: any) {
      console.log(e.response)
      console.log(e.response.data.message);
      throw new Error("Error fetching products");
    }
  }

  async LoginAdmin(email: string, password: string) {
    const ip = await this.getClientIp();
    try {
      const res = await axios({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/login`,
        data: { email, password, ip },
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async RegisterAdmin(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    try {
      const res = await axios({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/create`,
        data: { first_name, last_name, email, password },
      });
      console.log(res.data);
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async updateBusiness(data: { business_id: string, image?: string, name?: string }) {
    const { name, image, business_id } = data;
    try {
      const res = await api({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/business/update`,
        data: { name, image, business_id },
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async createBusiness(data: Business & { street: string, state: string, country: string }) {
    const { name, email, street, state, country } = data;
    try {
      const res = await api({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/business/create`,
        data: { name, email, street, state, country },
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async applySheet(business_id: string) {
    try {
      const res = await api({
        timeout: 10000000,
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/business/request-sheet`,
        data: { business_id },
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async createProduct(data: Product & { business_id: string }) {
    const { name, price, quantity, image, kg, business_id, description } = data;
    try {
      const res = await api({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/products`,
        data: { name, price, quantity, kg, image, business_id, description },
      });
      console.log({
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async updateProduct(
    product_id: string | any,
    data: Product & { business_id: string }
  ) {
    const { name, price, quantity, image, kg, business_id, description } = data;
    try {
      const res = await api({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/products/${product_id}`,
        data: { name, price, quantity, kg, image, business_id, description },
      });
      console.log({
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async deleteProduct(product_id: string, business_id: string) {
    try {
      const res = await api({
        method: "delete",
        url: `${env.VITE_SERVER_URL}/admin/products/${business_id}/${product_id}`,
      });
      console.log({
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      });
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async updateSettings({ business_id, settings_id, setting, state }: { business_id: string; settings_id?: string; setting: string, state: boolean }) {
    // console.log({ business_id, settings_id, setting })
    // console.log({ [`${setting}`]: state })
    try {
      const res = await api({
        method: "post",
        url: `${env.VITE_SERVER_URL}/admin/settings/update`,
        data: { settings_id, [`${setting}`]: state, business_id },
      });
      console.log(res.data);
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async getSettings(business_id: string) {
    try {
      const res = await api({
        method: "get",
        url: `${env.VITE_SERVER_URL}/admin/settings/${business_id}`,
      });
      // console.log(res.data.data);
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }

  async getClientIp() {
    const res = await axios.get("https://api.ipify.org?format=json");
    return res.data.ip;
  }

  async syncSheet(business_id: string, spreadsheet_id: string) {
    try {
      const res = await api({
        method: "POST",
        url: `${env.VITE_SERVER_URL}/admin/business/sync-sheet`,
        data: { business_id, spreadsheet_id },
      });
      // console.log(res.data.data);
      return {
        code: res.data.statusCode,
        status: res.data.httpStatus,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (e: any) {
      console.log(e);
      return {
        code: e.response.data.statusCode,
        status: e.response.data.httpStatus,
        message: e.response.data.message,
        data: e.response.data.data,
      };
    }
  }
}

export default new Server() as Server;
// console.log(await new Mastra().chatAgent("last question i asked u"))
