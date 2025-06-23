import { MastraClient } from "@mastra/client-js";
import env from "../config/env";
import axios from "axios";
 
class Server {
  private url = env.VITE_SERVER_URL as string;
  private agent_name = env.VITE_AGENT as string
  private client = new MastraClient({
    baseUrl: this.url as string
  })
  private agent = this.client.getAgent(this.agent_name)

  async chatAgent(input: string) {
    const { text } = await this.agent.generate({
      messages: [
        {
          role: "user",
          content: input,
        }
      ],
      threadId: "thread-1",
      resourceId: "resource-1"
    })
    console.log(text)
    return text
  }

  async getUsersDetails() {
    
  }

  async getBusinessDetails(id: string) {
    
  }

  async LoginAdmin(email: string, password: string) {
    try {
      const res = await axios({
        method: 'post',
        url: `${env.VITE_SERVER_URL}/admin/login`,
        data: { email, password }
      })
      return { code: res.data.statusCode, status: res.data.httpStatus, message: res.data.message, data: res.data.data}
    } catch(e: any) {
      console.log(e)
      return { code: e.response.data.statusCode, status: e.response.data.httpStatus, message: e.response.data.message, data: e.response.data.data}
    }
  }

  async RegisterAdmin(first_name: string, last_name: string, email: string, password: string) {
    try {
      const res = await axios({
        method: 'post',
        url: `${env.VITE_SERVER_URL}/admin/create`,
        data: { first_name, last_name, email, password }
      })
      console.log(res.data)
      return { code: res.data.statusCode, status: res.data.httpStatus, message: res.data.message, data: res.data.data}
    } catch(e: any) {
      console.log(e)
      return { code: e.response.data.statusCode, status: e.response.data.httpStatus, message: e.response.data.message, data: e.response.data.data}
    }
  }
}

export default new Server();
// console.log(await new Mastra().chatAgent("last question i asked u"))