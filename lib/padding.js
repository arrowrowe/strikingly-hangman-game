module.exports = (origin, model, fillWith, fillLeft) => {
  origin = origin.toString();
  model = model.toString();
  if (origin.length >= model.length) {
    return origin;
  }
  const pa = (fillWith === undefined ? '0' : fillWith).repeat(model.length - origin.length);
  return (fillLeft === undefined ? true: fillLeft) ? pa + origin : origin + pa;
};
