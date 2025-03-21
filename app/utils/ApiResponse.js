
const successResponse = (res, msg) => {
  if (!msg) {
    throw new Error('Message parameter is required for successResponse');
  }

  return res.status(200).json({
    response: {
      status: true,
      responseCode: 200,
      message: msg,
    },
  });
};
const successResponseWithData = (res, msg, data) => {
  return res.status(200).json({
    response: {
      status: true,
      responseCode: 200,
      message: msg,
    },
    data,
  });
};

const successFullyLoggedOut = (res, msg) => {
  if (!msg) {
    throw new Error('Message parameter is required for successFullyLoggedOut');
  }

  return res.status(200).json({
    response: {
      status: true,
      responseCode: 200,
      message: msg,
    },
  });
};

const ErrorResponse = (res, msg) => {
  if (!msg) {
    throw new Error('Message parameter is required for ErrorResponse');
  }

  return res.status(400).json({
    response: {
      status: false,
      responseCode: 400,
      message: msg,
    },
  });
};

const ErrorResponseWithData = (res, msg, data) => {
  if (!msg) {
    throw new Error('Message parameter is required for ErrorResponseWithData');
  }

  if (data === undefined) {
    throw new Error('Data parameter is required for ErrorResponseWithData');
  }

  return res.status(400).json({
    response: {
      status: false,
      responseCode: 400,
      message: msg,
    },
    data,
  });
};

module.exports = {
  successResponse,
  successResponseWithData,
  successFullyLoggedOut,
  ErrorResponse,
  ErrorResponseWithData,
};