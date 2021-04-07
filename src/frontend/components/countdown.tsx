import React, { Component, memo } from "react";
import ReactCountdownNow, { zeroPad } from "react-countdown-now";

export const Countdown = memo<any>(({ id, visible, now = undefined, date, waiting }) => {
  const renderer = ({ seconds, milliseconds, completed }) => {
    const msFormatted = (milliseconds / 10).toFixed();
    const msWithPadding = zeroPad(msFormatted, 2);
    if (completed) {
      return null;
    }
    return (
      <div>
        <div
          style={{
            letterSpacing: "2px",
            marginBottom: "4px",
            textAlign: "center"
          }}
        >
          {waiting ? "WAITING FOR BETS" : "ROLLING IN "}
        </div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            textAlign: "center"
          }}
        >
          {zeroPad(seconds, 0)}.{msWithPadding}
        </div>
      </div>
    );
  };

  return (
    <div style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <ReactCountdownNow
        key={id}
        zeroPadTime={0}
        intervalDelay={10}
        precision={2}
        renderer={renderer}
        now={now}
        date={date}
      />
    </div>
  )
});
