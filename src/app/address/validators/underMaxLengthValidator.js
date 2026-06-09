/**
  We need to use a custom max length validator for hmpoText fields.
  Having a validator type of maxlength causes hmpoText components to set the maxlength HTML attribute.
  This causes accessibility issues.
  */
export function underMaxLength(val, max) {
  return val.length <= max;
}
