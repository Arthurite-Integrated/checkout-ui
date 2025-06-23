import axios from 'axios'
import env from '../config/env'

export async function getBusinessDetails(store_id) {
  const validate = await axios.get(`${env.VITE_SERVER_URL}/`)
}