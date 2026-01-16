'use client';

import { Suspense, useEffect, useState } from 'react';

import { PageLayoutProps } from './PageLayout.types';
import { PageContent, PageWrapper } from './PageLayout.styles';

import { usePageWrapperRef } from '@/contexts/PageWrapperContext';
import { useDeviceType } from '@/contexts/DeviceTypeContext';

import Scrollbar from '@/components/Layouts/ScrollbarY/ScrollbarY';


import defaultbgImage from '@/public/images/background/bg.jpg';
import Header from '../Header/Header';


export default function PageLayout({ children }: PageLayoutProps) {
  const pageWrapperRef = usePageWrapperRef();
  const breakpoint = useDeviceType();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Suspense>
      <PageWrapper 
        ref={pageWrapperRef} 
        id="pageWrapper" 
        $bgImage={defaultbgImage} 
        $breakpoint={breakpoint} 
      >
        <Header />
        <Scrollbar contentRef={pageWrapperRef}/>
        <PageContent>{children}</PageContent>

      </PageWrapper>
    </Suspense>
  );
}
