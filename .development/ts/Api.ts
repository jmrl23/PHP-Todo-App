export enum RequestMethod {
  get     = 'GET',
  post    = 'POST',
  patch   = 'PATCH',
  put     = 'PUT',
  delete  = 'DELETE'
}

export default class Api {

  private readonly prefix: string = 'api'

  constructor(private readonly controller: string) {}

  public async makeRequest(method: RequestMethod, route: string, body?: object): Promise<any> {
    if (!route.startsWith('/')) route = '/' + route
    try {
      const response = await fetch(`${this.prefix}/${this.controller}${route}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      })
      const json = await response.json()
      return json
    } catch (error) {
      if (error instanceof Error) alert(error.message)
    }
  }
}