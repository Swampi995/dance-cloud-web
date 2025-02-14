import { useEffect, useState } from "react";

/**
 * A custom React hook to dynamically compute the number of rows (pageSize)
 * that can fit in the viewport based on a given row height.
 *
 * The hook listens to window resize events and recalculates the page size
 * using a debounced update, so the component updates only after the user
 * stops resizing.
 *
 * @param {number} [rowHeight=40.5] - The height of each row in pixels.
 * @returns {number} The computed page size (number of rows) that can fit in the available viewport.
 */
const useDynamicPageSize = (rowHeight = 40.5) => {
  // Initialize state with a fallback page size.
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Timer reference for debouncing the resize event.
    let debounceTimer: ReturnType<typeof setTimeout>;

    /**
     * Calculates and updates the page size based on the current window height.
     * Adjust the availableHeight calculation if you have additional UI elements (e.g., header, footer).
     */
    function updatePageSize() {
      // Calculate available height by subtracting a fixed offset (e.g., headers/footers).
      const availableHeight = window.innerHeight - 200;
      // Determine how many rows fit in the available height.
      const computedSize = Math.floor(availableHeight / rowHeight);
      // Ensure at least one row is displayed.
      setPageSize(computedSize > 0 ? computedSize : 1);
    }

    /**
     * Debounced handler for window resize events.
     * Clears any existing timer to ensure that updatePageSize is only called
     * after the user stops resizing for 1 second.
     */
    function handleResize() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePageSize, 1000);
    }

    // Compute the initial page size when the component mounts.
    updatePageSize();

    // Attach the resize event listener to handle dynamic updates.
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener and debounce timer when the component unmounts.
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [rowHeight]);

  return pageSize;
};

export { useDynamicPageSize };
