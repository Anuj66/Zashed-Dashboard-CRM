exports.success = (message, results, statusCode, count) => {
  return {
    message,
    error: false,
    code: statusCode,
    count: results.length,
    results,
  };
};

exports.error = (message, statusCode) => {
  return {
    message,
    code: statusCode,
    error: true,
  };
};

exports.validateRes = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors,
  };
};
