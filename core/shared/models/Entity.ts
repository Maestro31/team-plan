export abstract class Entity<IdentifierType, PropsType extends { id: IdentifierType }> {
  protected props: PropsType

  constructor(props: PropsType) {
    this.props = props
  }

  public get id(): IdentifierType {
    return this.props.id
  }

  public abstract toPrimitives(): Readonly<any>
}
