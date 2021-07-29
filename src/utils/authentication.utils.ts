import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { AxiosRequestConfig } from 'axios';
import database from 'database/database';
import roles from '@constant/roles';

export const getHeaders = (token: string): AxiosRequestConfig => {
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getServerSidePropsFunction = (rolePermission: number) => {
  return async (context: GetServerSidePropsContext) => {
    try {
      const token = context.req.cookies.user;
      if (!token) throw new Error();

      const { data } = await database.post('/auth/validateToken', {}, getHeaders(token));
      if (!data.valid) throw new Error();

      if (data.rolePermission !== rolePermission) throw new Error();

      return {
        props: {},
      };
    } catch (err) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
};

export const getServerSidePropsAdminFunction = getServerSidePropsFunction(roles.ADMIN.PERMISSION);
