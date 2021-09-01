import { useEffect, useState } from 'react';

import type { Socket } from 'socket.io-client';

import socketIOClient from 'socket.io-client';

import SERVER from '@constant/server';

const useSocket = (token: string | null): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = socketIOClient(SERVER.ENDPOINT, { query: { token: token } });
    setSocket(newSocket);
  }, [token]);

  return socket;
};

export default useSocket;
