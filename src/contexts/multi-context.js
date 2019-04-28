import React from "react";

export default function MultiContextProvider({ contexts, children }) {
  return contexts.reduce(
    (result, [ctx, value]) =>
      React.createElement(
        ctx.Provider,
        {
          value,
        },
        result || children,
      ),
    null,
  );
}
