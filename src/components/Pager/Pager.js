import React, { useEffect, useRef } from 'react';
import plot from '../../data/plot';
import styles from './Pager.module.css';

const Pager = props => {
  const pageRef = useRef();

  useEffect(() => {
    pageRef.current.innerHTML = plot;
    if (checkOverflow()) {
      const splitContent = pageRef.current.innerHTML.match(
        /(<[^>]+>|[^<\s]+(?=( |<))|\s+)/gy
      );

      pageRef.current.innerHTML = '';
      let confirmed = pageRef.current.innerHTML;

      fill(splitContent.length, splitContent);

      function fill(length, content) {
        const halfLength = Math.round(length / 2);

        const halfContent = content.slice(0, halfLength);

        const test = confirmed + halfContent.join('');
        pageRef.current.innerHTML = test;
        if (checkOverflow()) {
          pageRef.current.innerHTML = confirmed;
          if (halfLength > 1) {
            fill(halfLength, content);
          }
        } else {
          confirmed = test;
          if (halfLength > 1) {
            fill(halfLength, content.slice(halfLength));
          }
        }
      }
    }

    function checkOverflow() {
      const el = pageRef.current;
      const currentOverflow = el.style.overflow;
      if (!currentOverflow || currentOverflow === 'visible') {
        el.style.overflow = 'hidden';
      }

      const isOverflowing =
        el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

      el.style.overflow = currentOverflow;

      return isOverflowing;
    }
  }, []);

  return (
    <div
      ref={pageRef}
      className={styles.container}
      // dangerouslySetInnerHTML={{ __html: plot }}
    />
  );
};

export default Pager;
