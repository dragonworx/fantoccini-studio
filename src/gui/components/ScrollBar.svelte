<style lang="scss">
  @import "../theme";

  .scrollbar {
    flex-grow: 1;
    border: 1px inset #6e6e6eb8;
    display: flex;
    border-radius: $scrollbar_radius;
    box-sizing: border-box;

    &.enabled:focus,
    &.enabled:focus-visible {
      @include focus;
    }

    &.enabled .scrollbar-thumb:hover {
      @include button_enabled_hover;
    }

    &.enabled .scrollbar-thumb:active {
      @include button_enabled_active;
    }

    &.enabled .scrollbar-track-upper:active,
    &.enabled .scrollbar-track-lower:active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &.horizontal {
      @include linear_gradient(#3c434d, #2f343c, 180deg);
      height: $scrollbar_size;
      max-height: $scrollbar_size;
      width: 100%;

      .scrollbar-track {
        min-height: 20px;

        .scrollbar-thumb {
          height: $scrollbar_size - 2;
        }
      }

      .scrollbar-track-upper {
        height: $scrollbar_size;
        max-height: $scrollbar_size;
      }

      .scrollbar-track-lower {
        height: $scrollbar_size;
        max-height: $scrollbar_size;
      }
    }

    &.vertical {
      @include linear_gradient(#3c434d, #2f343c, 90deg);
      width: $scrollbar_size;
      max-width: $scrollbar_size;
      height: 100%;

      .scrollbar-track {
        min-width: 20px;

        .scrollbar-thumb {
          width: $scrollbar_size - 2;
        }
      }

      .scrollbar-track-upper {
        width: $scrollbar_size;
        max-width: $scrollbar_size;
      }

      .scrollbar-track-lower {
        width: $scrollbar_size;
        max-width: $scrollbar_size;
      }
    }

    .scrollbar-track {
      flex-grow: 1;
      position: relative;
      overflow: hidden;

      .scrollbar-thumb {
        @include button_enabled_fill;
        @include button_border_up;
        box-sizing: border-box;
        width: $scrollbar_size;
        height: $scrollbar_size;
        border-radius: $scrollbar_radius;
        position: absolute;
        top: 0;
        left: 0;
      }

      .scrollbar-track-upper,
      .scrollbar-track-lower {
        position: absolute;
        border: none;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        background-color: transparent;
      }
    }
  }

  .scrollbar.disabled.horizontal {
    @include scrollbar_disabled();
  }

  .scrollbar.disabled.vertical {
    @include scrollbar_disabled(-90deg);
  }
</style>

<script context="module">
  export const scrollSize = 20;
  export const longPressInitialDelay = 250;
  export const longPressRepeatInterval = 100;
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import {
    isArrowKey,
    isScrollDownKey,
    isScrollUpKey,
    Direction,
    watchResize,
  } from "../";

  const dispatch = createEventDispatcher();

  export let isEnabled: boolean = true;
  export let direction: Direction;
  export let value: number;
  export let thumbSize: number = scrollSize;
  export let incrementSmall: number = 0.1;
  export let incrementLarge: number = 0.3;
  export let size: number = -1;

  const isHorizontal = direction === "horizontal";

  let container: HTMLElement;
  let observer: ResizeObserver;
  let trackWidth: number;
  let trackHeight: number;
  let trackSize: number;
  let dragThumbPos: number;
  let dragMousedown: { x: number; y: number } = { x: 0, y: 0 };
  let longPressStartTimeout: number;
  let longPressInterval: number;

  onMount(() => {
    observer = watchResize(container, (width, height) => {
      trackWidth = width;
      trackHeight = height;
    });
  });

  onDestroy(() => {
    observer.unobserve(container);
  });

  $: style = `${isHorizontal ? "width" : "height"}:${
    size === -1 ? "100%" : `${size}px`
  }`;

  $: trackSize = isHorizontal ? trackWidth : trackHeight;
  $: thumbPos = (trackSize - thumbSize) * value;
  $: thumbStyle = isHorizontal
    ? `left:${thumbPos}px;width:${thumbSize}px;`
    : `top:${thumbPos}px;height:${thumbSize}px;`;
  $: trackUpperStyle = isHorizontal
    ? `width:${thumbPos}px`
    : `height:${thumbPos}px`;
  $: trackLowerStyle = isHorizontal
    ? `left:${thumbPos + thumbSize}px;width:${
        trackSize - (thumbPos + thumbSize)
      }px`
    : `top:${thumbPos + thumbSize}px;height:${
        trackSize - (thumbPos + thumbSize)
      }px`;

  function setValue(newValue: number) {
    value = Math.max(0, Math.min(1, newValue));
    dispatch("change", value);
    return value;
  }

  function handleLongPress(increment) {
    const clearStartTimeout = () => {
      clearTimeout(longPressStartTimeout);
      window.removeEventListener("mouseup", clearStartTimeout);
    };
    window.addEventListener("mouseup", clearStartTimeout);
    longPressStartTimeout = setTimeout(() => {
      const clearPressInterval = () => {
        clearInterval(longPressInterval);
        window.removeEventListener("mouseup", clearPressInterval);
      };
      window.addEventListener("mouseup", clearPressInterval);

      longPressInterval = setInterval(() => {
        setValue(value + increment);
      }, longPressRepeatInterval) as unknown as number;
    }, longPressInitialDelay) as unknown as number;
  }

  const onTrackUpperMouseDown = (e: MouseEvent) => {
    if (!isEnabled) {
      return;
    }
    const increment = e.shiftKey ? incrementLarge : incrementSmall;
    setValue(value - increment);
    handleLongPress(increment * -1);
  };

  const onTrackLowerMouseDown = (e: MouseEvent) => {
    if (!isEnabled) {
      return;
    }
    const increment = e.shiftKey ? incrementLarge : incrementSmall;
    setValue(value + increment);
    handleLongPress(increment);
  };

  const onThumbMouseDown = (e: MouseEvent) => {
    if (!isEnabled) {
      return;
    }
    const onMouseMove = (e: MouseEvent) => {
      const delta = isHorizontal
        ? e.clientX - dragMousedown.x
        : e.clientY - dragMousedown.y;
      const newThumbPos = dragThumbPos + delta;
      setValue(newThumbPos / (trackSize - thumbSize));
    };

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    dragThumbPos = thumbPos;
    dragMousedown.x = e.clientX;
    dragMousedown.y = e.clientY;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!isEnabled) {
      return;
    }
    const { key } = e;
    if (isArrowKey(key)) {
      if (isScrollUpKey(key)) {
        setValue(value - incrementSmall);
      } else if (isScrollDownKey(key)) {
        setValue(value + incrementSmall);
      }
      e.preventDefault();
    }
  };

  const onMouseWheel = (e: WheelEvent) => {
    const { deltaX, deltaY } = e;
    if (isHorizontal) {
      if (deltaX > 0) {
        setValue(value - incrementSmall);
      } else if (deltaX < 0) {
        setValue(value + incrementSmall);
      }
    } else {
      if (deltaY < 0) {
        setValue(value - incrementSmall);
      } else if (deltaY > 0) {
        setValue(value + incrementSmall);
      }
    }
    e.preventDefault();
  };
</script>

<div
  class="scrollbar"
  class:vertical={direction === "vertical"}
  class:horizontal={direction === "horizontal"}
  class:enabled={isEnabled}
  class:disabled={!isEnabled}
  {style}
  data-component="scrollbar"
  data-direction={direction}
  tabindex={isEnabled ? 0 : -1}
  on:keydown={onKeyDown}
  on:wheel={onMouseWheel}
>
  <div bind:this={container} class="scrollbar-track">
    <div
      class="scrollbar-track-upper"
      style={trackUpperStyle}
      on:mousedown={onTrackUpperMouseDown}
    />
    {#if isEnabled}
      <div
        class="scrollbar-thumb"
        style={thumbStyle}
        on:mousedown={onThumbMouseDown}
      />
    {/if}
    <div
      class="scrollbar-track-lower"
      style={trackLowerStyle}
      on:mousedown={onTrackLowerMouseDown}
    />
  </div>
</div>
