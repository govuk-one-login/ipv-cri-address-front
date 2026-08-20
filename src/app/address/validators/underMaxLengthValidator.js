/**
  We use a custom max length validator to avoid the type name "maxlength".
  Having a validator type of maxlength causes the maxlength HTML attribute
  to be set, which truncates input silently rather than showing a validation error.
  */
export function underMaxLength(val, max) {
  return val.length <= max;
}
