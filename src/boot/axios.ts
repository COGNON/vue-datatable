import axios from 'axios';

enum StatusCode {
  MissingParameters = 400,
  MethodNotAllowed = 405,
  PageDoesNotExist = 404,
  Unauthorized = 403,
}
