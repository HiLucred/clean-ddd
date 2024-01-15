import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Prop> {
  private _id: UniqueEntityID
  protected props: Prop

  get id() {
    return this._id
  }

  protected constructor(props: Prop, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID()
    this.props = props
  }

  public equals(entity: Entity<any>) {
    if (entity === this) return true
    if (entity.id === this._id) return true

    return false
  }
}
