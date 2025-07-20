export enum HttpStatus {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,

  INTERNAL_SERVER_ERROR = 500,

  REDIRECT_PERMANENTLY = 301,

  SUCCESS = 200,
  CREATED = 201,
}

export enum Messages {
  URL_REQUIRED = "Insira a URL para prosseguir.",
  INVALID_URL = "Url enviada é inválida.",
  URL_EXISTS = "Url enviada já foi cadastrada.",
  GET_URL_SUCCESS = "Url capturada com sucesso! Redirecionando...",
  INTERNAL_SERVER_ERROR = "Erro interno ao criar o código, tente novamente.",
  URL_CREATED = "URL criada com sucesso!",
  URL_NOT_FIND = "Codigo não cadastrado, cadastre o site e tente novamente.",
}
