import React from "react";

export default ({ i18n }) => {
  return (
    <div>
      <button onClick={() => i18n.changeLanguage("en-US")}>English</button>
      <button onClick={() => i18n.changeLanguage("nl-NL")}>Dutch</button>
      <button onClick={() => i18n.changeLanguage("no-NO")}>Undefined Language</button>
    </div>
  );
};
