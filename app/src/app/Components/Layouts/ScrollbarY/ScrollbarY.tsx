"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDeviceType } from "@/contexts/DeviceTypeContext";

import {
  StyledScrollbarTrackAndThumb,
  StyledScrollbar,
  Thumb,
  Track,
} from "./ScrollbarY.styles";

type ScrollbarYProps = {
  contentRef: React.RefObject<HTMLElement>; // <-- Agora é modular
  breakpointOverride?: 'sm' | 'md' | 'lg' | 'xl'; // opcional
};

export default function ScrollbarY({
  contentRef,
  breakpointOverride,
}: ScrollbarYProps) {
  const breakpoint = breakpointOverride ?? useDeviceType();

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);

  const [initialContentScrollTop, setInitialContentScrollTop] = useState(0);
  const [scrollStartPosition, setScrollStartPosition] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);

  // ------------------------------------------
  // Recalculate thumb height based on content
  // ------------------------------------------
  const handleResize = useCallback(() => {
    const track = scrollTrackRef.current;
    const content = contentRef.current;
    if (!track || !content) return;

    const trackSize = track.clientHeight;
    const contentVisible = content.clientHeight;
    const contentTotalHeight = content.scrollHeight;

    setThumbHeight(Math.max((contentVisible / contentTotalHeight) * trackSize, 20));
  }, [contentRef]);

  // ------------------------------------------
  // Calculate thumb position
  // ------------------------------------------
  const handleThumbPosition = useCallback(() => {
    const track = scrollTrackRef.current;
    const content = contentRef.current;
    const thumb = scrollThumbRef.current;
    if (!track || !content || !thumb) return;

    const contentTop = content.scrollTop;
    const contentHeight = content.scrollHeight;
    const trackHeight = track.clientHeight;

    let newTop = (contentTop / contentHeight) * trackHeight;

    newTop = Math.min(newTop, trackHeight - thumbHeight);

    requestAnimationFrame(() => {
      thumb.style.top = `${newTop}px`;
    });
  }, [thumbHeight, contentRef]);

  // ------------------------------------------
  // Mouse move while dragging
  // ------------------------------------------
  const handleThumbMousemove = useCallback(
    (e: MouseEvent) => {
      const content = contentRef.current;
      if (!content) return;
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      const { scrollHeight, clientHeight } = content;
      const deltaY = (e.clientY - scrollStartPosition) * (clientHeight / thumbHeight);

      const newScrollTop = Math.min(
        initialContentScrollTop + deltaY,
        scrollHeight - clientHeight
      );

      content.scrollTop = newScrollTop;
    },
    [
      isDragging,
      contentRef,
      initialContentScrollTop,
      scrollStartPosition,
      thumbHeight,
    ]
  );

  // ------------------------------------------
  // Mouse up
  // ------------------------------------------
  const handleThumbMouseup = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  // ------------------------------------------
  // Attach observers + scroll listeners
  // ------------------------------------------
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // Resize observer
    const resizeObs = new ResizeObserver(() => {
      handleResize();
      handleThumbPosition();
    });
    resizeObs.observe(content);

    // Mutation observer
    const mutationObs = new MutationObserver(() => {
      handleResize();
      handleThumbPosition();
    });
    mutationObs.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Scroll -> update thumb
    content.addEventListener("scroll", handleThumbPosition);

    return () => {
      resizeObs.disconnect();
      mutationObs.disconnect();
      content.removeEventListener("scroll", handleThumbPosition);
    };
  }, [contentRef, handleResize, handleThumbPosition]);

  // ------------------------------------------
  // Thumb down
  // ------------------------------------------
  function handleThumbMousedown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    setScrollStartPosition(e.clientY);

    if (contentRef.current) {
      setInitialContentScrollTop(contentRef.current.scrollTop);
    }

    setIsDragging(true);
  }

  // ------------------------------------------
  // Global mouse events
  // ------------------------------------------
  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMousemove);
    document.addEventListener("mouseup", handleThumbMouseup);

    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove);
      document.removeEventListener("mouseup", handleThumbMouseup);
    };
  }, [handleThumbMousemove, handleThumbMouseup]);

  // ------------------------------------------
  // Track click
  // ------------------------------------------
  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    const track = scrollTrackRef.current;
    const content = contentRef.current;
    if (!track || !content) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top - thumbHeight / 2;
    const ratio = clickY / track.clientHeight;

    const scrollAmount = ratio * content.scrollHeight;

    content.scrollTo({
      top: scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <StyledScrollbar>
      <StyledScrollbarTrackAndThumb $breakpoint={breakpoint}>
        <Track
          ref={scrollTrackRef}
          onClick={handleTrackClick}
          style={{ cursor: isDragging ? "grabbing" : undefined }}
        />
        <Thumb
          ref={scrollThumbRef}
          onMouseDown={handleThumbMousedown}
          style={{
            height: `${thumbHeight}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        />
      </StyledScrollbarTrackAndThumb>
    </StyledScrollbar>
  );
}
