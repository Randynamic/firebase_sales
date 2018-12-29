import React from "react";
import styles from "./Feedback.scss";

const FeedbackTypes = {
  error: ({ type, message }) => {
    const feedbackStyleName = styles[`feedback__${type}__wrapper`];
    return <div className={feedbackStyleName}>{message}</div>;
  }
};

export default ({ feedback }) => {
  const FeedbackType = feedback.type || "Info";
  return <div className="feedback">{FeedbackTypes[FeedbackType](feedback)}</div>;
};
