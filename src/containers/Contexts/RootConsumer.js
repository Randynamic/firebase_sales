import React from "react";

import { I18nContext } from "./I18n";
import { SessionContext } from "./Session";

export const PublicConsumer = props => {
  const { ConsumingComponent, ...rest } = props;
  return (
    <I18nContext.Consumer>
      {i18n => (
        // Wrapping component with Context Consumers
        <ConsumingComponent {...rest} {...i18n} />
      )}
    </I18nContext.Consumer>
  );
};

export const PrivateConsumer = props => {
  const { ConsumingComponent, ...rest } = props;
  return (
    <I18nContext.Consumer>
      {i18n => (
        <SessionContext.Consumer>
          {session => (
            // Wrapping component with Context Consumers
            <ConsumingComponent {...rest} {...session} {...i18n} />
          )}
        </SessionContext.Consumer>
      )}
    </I18nContext.Consumer>
  );
};
