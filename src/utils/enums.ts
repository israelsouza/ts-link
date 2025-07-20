export enum HttpStatus {
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    SUCCESS = 200,
    CREATED = 201
}

export enum Messages {
    URL_REQUIRED = 'Insira a URL para prosseguir.',
    INVALID_URL = 'Url enviada é inválida.',
    URL_EXISTS = 'Url enviada já foi cadastrada.',
    INTERNAL_SERVER_ERROR = 'Erro interno ao criar o código, tente novamente.',
    URL_CREATED = 'URL criada com sucesso!'
}