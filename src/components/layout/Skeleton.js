// "use client";

// import React from "react";

// const Skeleton = ({ children }) => {
//   if (!children) return null;

//   // Handle text or number → small line
//   if (typeof children === "string" || typeof children === "number") {
//     return <div className="bg-gray-300 animate-pulse rounded h-4 w-full"></div>;
//   }

//   // Handle array → map recursively
//   if (Array.isArray(children)) {
//     return children.map((child, idx) => <Skeleton key={idx}>{child}</Skeleton>);
//   }

//   // Handle React element
//   if (React.isValidElement(children)) {
//     const { type, props } = children;

//     // Detect layout elements
//     const isFlex = props.className?.includes("flex");
//     const isGrid = props.className?.includes("grid");

//     // Copy styles for layout
//     const layoutProps = {};
//     if (isFlex || isGrid) layoutProps.className = props.className;

//     // Replace content with skeleton for text or buttons
//     if (type === "p" || type === "span" || type === "h1" || type === "h2" || type === "button") {
//       return <div className="bg-gray-300 animate-pulse rounded h-4 w-full"></div>;
//     }

//     // Recurse children
//     return (
//       <div {...layoutProps}>
//         <Skeleton>{props.children}</Skeleton>
//       </div>
//     );
//   }

//   return null;
// };

// export default Skeleton;
"use client";

import React from "react";

const Skeleton = ({ children }) => {
  if (!children) return null;

  // Handle text or number → small line
  if (typeof children === "string" || typeof children === "number") {
    return <div className="bg-gray-300 animate-pulse rounded h-4 w-full my-1"></div>;
  }

  // Handle array → map recursively
  if (Array.isArray(children)) {
    return children.map((child, idx) => <Skeleton key={idx}>{child}</Skeleton>);
  }

  // Handle React element
  if (React.isValidElement(children)) {
    const { type, props } = children;

    // Default skeleton style
    let skeletonStyle = "bg-gray-300 animate-pulse rounded";

    // Layout elements → recurse children
    if (
      typeof type === "string" &&
      ["div", "section", "article", "main", "header", "footer", "span", "p", "h1", "h2", "h3", "h4"].includes(type)
    ) {
      return (
        <div className={props.className}>
          <Skeleton>{props.children}</Skeleton>
        </div>
      );
    }

    // Buttons
    if (type === "button") {
      return <div className={`${skeletonStyle} h-8 w-24`}></div>;
    }

    // Images
    if (type === "img") {
      return <div className={`${skeletonStyle} h-40 w-full rounded-md`}></div>;
    }

    // Videos
    if (type === "video") {
      return <div className={`${skeletonStyle} h-48 w-full rounded-md`}></div>;
    }

    // Tables
    if (type === "table") {
      const rows = 3;
      const cols = props.children?.[0]?.props?.children?.length || 3;
      return (
        <table className={props.className}>
          <tbody>
            {[...Array(rows)].map((_, rIdx) => (
              <tr key={rIdx}>
                {[...Array(cols)].map((_, cIdx) => (
                  <td key={cIdx} className="p-2">
                    <div className={`${skeletonStyle} h-4 w-16`}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Charts (like div wrapper)
    if (props.className?.includes("chart") || props.className?.includes("graph")) {
      return <div className={`${skeletonStyle} h-48 w-full rounded-md`}></div>;
    }

    // Default → recurse
    return <div className={props.className}><Skeleton>{props.children}</Skeleton></div>;
  }

  return null;
};

export default Skeleton;
