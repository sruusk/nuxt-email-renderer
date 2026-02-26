export const withMargin = (props) => {
  const nonEmptyStyles = [
    withSpace(props.m, ["margin"]),
    withSpace(props.mx, ["marginLeft", "marginRight"]),
    withSpace(props.my, ["marginTop", "marginBottom"]),
    withSpace(props.mt, ["marginTop"]),
    withSpace(props.mr, ["marginRight"]),
    withSpace(props.mb, ["marginBottom"]),
    withSpace(props.ml, ["marginLeft"])
  ].filter((s) => Object.keys(s).length);
  const mergedStyles = nonEmptyStyles.reduce((acc, style) => {
    return { ...acc, ...style };
  }, {});
  return mergedStyles;
};
export const withSpace = (value, properties) => {
  return properties.reduce((styles, property) => {
    if (!Number.isNaN(Number.parseFloat(value))) {
      return { ...styles, [property]: `${value}px` };
    }
    return styles;
  }, {});
};
