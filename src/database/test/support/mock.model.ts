//* It will used for every mongodb test for Every Repository Test
//* It means it must provide every findOne, findById, ... from the whole the repositories.
export abstract class MockModel<T> {
  protected abstract entityStub: T;

  custronctor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async findOne(): Promise<T> {
    return this.entityStub;
  }

  async findById(): Promise<T> {
    return this.entityStub;
  }

  async save(): Promise<T> {
    return this.entityStub;
  }
}
