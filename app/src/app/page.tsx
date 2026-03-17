import { Metadata } from 'next';

import Home from './(pages)/Result/page';


export function generateMetadata(): Promise<Metadata> {
  return Promise.resolve({
    title: 'Home',
    description: 'Home Page',
  });
};

export default function Page() {
  return (
    <Home />
  );
}
