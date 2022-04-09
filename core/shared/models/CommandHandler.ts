export interface CommandHandler<Payload, Response> {
  execute(payload: Payload): Response
}
