import React from "react";
import { Route } from "react-router-dom";

import { PublicConsumer } from "../Contexts/RootConsumer";

/**
 *
 * @name ContextRoute
 *
 * Contextual Route Component
 * @description	For all public routes
 *
 */
export default props => {
  const { component: WrappedComponent, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        return (
          //
          <PublicConsumer ConsumingComponent={WrappedComponent} {...props} />
        );
      }}
    />
  );
};
