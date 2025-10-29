import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

// Card component
export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

// Utility to define card slots
const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

// Place a card at a slot initially
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 300,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  skewAmount = 6,
  delay = 4000,
  pauseOnHover = false,
  onCardClick,
  onCardSwap, // callback for updating left content
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? { ease: 'elastic.out(0.6,0.9)', durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: 'power1.inOut', durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);
  const hoverRef = useRef(false);

  // Initial placement
  useEffect(() => {
    refs.forEach((r, i) =>
      placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, refs.length), skewAmount)
    );
  }, [refs, cardDistance, verticalDistance, skewAmount]);

  // Swap cards
  useEffect(() => {
    const swap = () => {
      if (order.current.length < 2 || hoverRef.current) return; // skip if hovering

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;

      // Update left content immediately with the NEXT card only if not hovering
      onCardSwap?.(rest[0]);

      const tl = gsap.timeline();
      tlRef.current = tl;

      // Drop front card
      tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease });

      // Promote other cards
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      // Move front card to back
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');

      // Update order after animation
      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const onEnter = () => (hoverRef.current = true);
      const onLeave = () => (hoverRef.current = false);
      node.addEventListener('mouseenter', onEnter);
      node.addEventListener('mouseleave', onLeave);

      return () => {
        node.removeEventListener('mouseenter', onEnter);
        node.removeEventListener('mouseleave', onLeave);
        clearInterval(intervalRef.current);
      };
    }

    return () => clearInterval(intervalRef.current);
  }, [refs, config, cardDistance, verticalDistance, delay, onCardSwap, pauseOnHover]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
            onCardSwap?.(i); // update left content immediately on click
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
