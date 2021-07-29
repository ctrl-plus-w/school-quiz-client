import axios from 'axios';

import server from '@constant/server';

export default axios.create({
  baseURL: server.endpoint,
});
