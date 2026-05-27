import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";

export default function App() {
  return (
    <div style={{ padding: 100 }}>
      <h1>useEffect vs useLayoutEffect</h1>

      <h2>1. useEffect (Visible Jump)</h2>
      <EffectTooltip />

      <br />
      <br />
      <br />

      <h2>2. useLayoutEffect (No Jump)</h2>
      <LayoutTooltip />
    </div>
  );
}

/* =====================================================
   useEffect Example
===================================================== */

function EffectTooltip() {
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  const [show, setShow] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    let timer;

    if (show) {
      timer = setTimeout(() => {
        // SAFE CHECK
        if (!buttonRef.current || !tooltipRef.current) return;

        const btn = buttonRef.current.getBoundingClientRect();
        const tip = tooltipRef.current.getBoundingClientRect();

        setPosition({
          top: btn.top - tip.height - 10,
          left: btn.left + btn.width / 2 - tip.width / 2,
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [show]);

  return (
    <div>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        Hover Me
      </button>

      {show && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            background: "red",
            color: "white",
            padding: 10,
            borderRadius: 5,
            transition: "all 0.3s",
          }}
        >
          useEffect Tooltip
        </div>
      )}
    </div>
  );
}

/* =====================================================
   useLayoutEffect Example
===================================================== */

function LayoutTooltip() {
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  const [show, setShow] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (show) {
      // SAFE CHECK
      if (!buttonRef.current || !tooltipRef.current) return;

      const btn = buttonRef.current.getBoundingClientRect();
      const tip = tooltipRef.current.getBoundingClientRect();
      //getBoundingClientRect() is a built-in DOM method that tells you the exact size and position of an element on the screen.

      setPosition({
        top: btn.top - tip.height - 10,
        left: btn.left + btn.width / 2 - tip.width / 2,
      });
    }
  }, [show]);

  return (
    <div>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        Hover Me
      </button>

      {show && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            background: "green",
            color: "white",
            padding: 10,
            borderRadius: 5,
          }}
        >
          useLayoutEffect Tooltip
        </div>
      )}
    </div>
  );
}
