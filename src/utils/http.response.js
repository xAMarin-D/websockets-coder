const HttpStatus = {
  OK: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

const errorDictionary = {
  NOT_FOUND: "NOT FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SERVER_ERROR: "INTERNAL SERVER ERROR",
};

export class HttpResponse {
  Ok(res, data) {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      messagge: "Success",
      data,
    });
  }

  NotFound(res, data) {
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      messagge: errorDictionary.NOT_FOUND,
      data,
    });
  }

  Unauthorized(res, data) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      messagge: errorDictionary.UNAUTHORIZED,
      data,
    });
  }

  Forbidden(res, data) {
    return res.status(HttpStatus.FORBIDDEN).json({
      status: HttpStatus.FORBIDDEN,
      messagge: errorDictionary.FORBIDDEN,
      data,
    });
  }

  ServerError(res, data) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messagge: errorDictionary.SERVER_ERROR,
      data,
    });
  }
}
