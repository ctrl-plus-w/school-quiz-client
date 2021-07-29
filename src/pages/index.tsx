import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Hello World !</h1>

      <Link href="/admin-dashboard">
        <a>Admin dashboard</a>
      </Link>

      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
};

export default Home;
