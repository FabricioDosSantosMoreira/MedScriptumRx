'use client'

import { useRouter } from 'next/navigation'; 


export default function useHandleNavigation() {
  const router = useRouter();
  
  // Not the best way, but i wanted to reload the page when clicking a button that pushes to the same page.
  // NOTE: Only works using NextJS App Router.
  const handleNavigation = (path: string) => {
    if (window.location.pathname === path) {
      window.location.reload();
    } else {
      router.push(path); 
    }
  };
  
  return handleNavigation;  
}
