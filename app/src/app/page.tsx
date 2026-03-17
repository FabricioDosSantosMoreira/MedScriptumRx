import { Metadata } from 'next';

import Home from './(pages)/Result/page';


export function generateMetadata(): Promise<Metadata> {
  return Promise.resolve({
    title: 'Index',
    description: 'Index Page',
  });
};

export default function Page() {
  return (
    <Home />
  );
}
