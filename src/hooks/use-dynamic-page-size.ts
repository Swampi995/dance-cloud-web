import { useEffect, useState } from "react";

const useDynamicPageSize = (rowHeight = 40.5) => {
  const [pageSize, setPageSize] = useState(10); // fallback page size

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    function updatePageSize() {
      // Subtract any fixed header, footer, or padding heights if needed
      const availableHeight = window.innerHeight - 300;
      const computedSize = Math.floor(availableHeight / rowHeight);
      setPageSize(computedSize > 0 ? computedSize : 1);
    }

    function handleResize() {
      // Clear any existing timer so we only run once user stops resizing (for X ms)
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePageSize, 1000);
    }

    // Measure on mount
    updatePageSize();

    // Attach the debounced resize handler
    window.addEventListener("resize", handleResize);

    // Cleanup when unmounting
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [rowHeight]);

  return pageSize;
};

export { useDynamicPageSize };
