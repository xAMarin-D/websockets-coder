const HttpStatus = {
  OK: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const errorDictionary = {
  NOT_FOUND: "NOT FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  BAD_REQUEST: "BAD REQUEST",
  SERVER_ERROR: "INTERNAL SERVER ERROR",
};

export class HttpResponse {
  Ok(res, data) {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "Success",
      data,
    });
  }

  NotFound(res, data) {
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      message: errorDictionary.NOT_FOUND,
      data,
    });
  }

  Unauthorized(res, data) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      message: errorDictionary.UNAUTHORIZED,
      data,
    });
  }

  Forbidden(res, data) {
    return res.status(HttpStatus.FORBIDDEN).json({
      status: HttpStatus.FORBIDDEN,
      message: errorDictionary.FORBIDDEN,
      data,
    });
  }

  BadRequest(res, data) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message: errorDictionary.BAD_REQUEST,
      data,
    });
  }

  ServerError(res, data) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorDictionary.SERVER_ERROR,
      data,
    });
  }
}
