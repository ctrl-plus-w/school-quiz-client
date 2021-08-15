import axios from 'axios';

import SERVER from '@constant/server';

export default axios.create({
  baseURL: SERVER.endpoint,
});
