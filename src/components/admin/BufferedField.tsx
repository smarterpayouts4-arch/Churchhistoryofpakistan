"use client";

import { useState, type FocusEvent, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

/**
 * Text boxes that never rewrite what the owner is typing.
 *
 * While the box has focus it shows exactly the letters typed (spaces,
 * capitals, commas and new lines included), even if the saved copy is
 * tidied up behind the scenes (for example the server trims spaces, or a
 * list is split on commas). When the owner leaves the box it shows the
 * saved value again, with spaces trimmed from the ends.
 *
 * Rewriting a focused box's text while someone types is what lost spaces
 * and reset the Shift key on iPhone, so every admin field whose saved value
 * can differ from the typed text should use one of these.
 */
type Buffered = {
  value: string;
  /** Called on every keystroke with the typed text, and once more on leaving the box (trimmed). */
  onValue: (text: string) => void;
  /** Trim spaces from both ends when the owner leaves the box (default true). */
  trimOnBlur?: boolean;
};

function useBuffered<E extends HTMLInputElement | HTMLTextAreaElement>(
  { value, onValue, trimOnBlur = true }: Buffered,
  onFocus?: (e: FocusEvent<E>) => void,
  onBlur?: (e: FocusEvent<E>) => void,
) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(value);
  return {
    value: focused ? text : value,
    onFocus: (e: FocusEvent<E>) => {
      setText(value);
      setFocused(true);
      onFocus?.(e);
    },
    onChange: (e: { target: { value: string } }) => {
      setText(e.target.value);
      onValue(e.target.value);
    },
    onBlur: (e: FocusEvent<E>) => {
      setFocused(false);
      const typed = e.currentTarget.value;
      const done = trimOnBlur ? typed.trim() : typed;
      if (done !== typed) onValue(done);
      onBlur?.(e);
    },
  };
}

type InputProps = Buffered & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange">;
type TextareaProps = Buffered & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange">;

export function BufferedInput({ value, onValue, trimOnBlur, onFocus, onBlur, ...rest }: InputProps) {
  const field = useBuffered<HTMLInputElement>({ value, onValue, trimOnBlur }, onFocus, onBlur);
  return <input {...rest} {...field} />;
}

export function BufferedTextarea({ value, onValue, trimOnBlur, onFocus, onBlur, ...rest }: TextareaProps) {
  const field = useBuffered<HTMLTextAreaElement>({ value, onValue, trimOnBlur }, onFocus, onBlur);
  return <textarea {...rest} {...field} />;
}
