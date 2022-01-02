/* eslint-env node */

import handleError from '../../helpers/handleError.js'

import type { AdapterOperator } from '../../types'

export default class Operator<T> implements AdapterOperator<T> {
  #model: string
  #prismaInstance: any

  constructor(prismaInstance: any, model: string) {
    this.#model = model
    this.#prismaInstance = prismaInstance
  }

  public async count(): Promise<number> {
    try {
      const count = await this.#prismaInstance[this.#model].count()

      return count
    } catch (err) {
      handleError(err, `adapters/PrismaAdapter.${this.#model}.count()`, true)
    }
  }

  public async create(data: Record<string, any>): Promise<T> {
    try {
      const entity = await this.#prismaInstance[this.#model].create({
        data,
      })

      return entity
    } catch (err) {
      handleError(err, `adapters/PrismaAdapter.${this.#model}.create()`, true)
    }
  }

  public async delete(where: Record<string, any>): Promise<T | null> {
    try {
      const entity = await this.#prismaInstance[this.#model].delete({
        where,
      })

      return entity
    } catch (err) {
      handleError(err, `adapters/PrismaAdapter.${this.#model}.delete()`, true)
    }
  }

  public async deleteMany(where: Record<string, any>): Promise<T[]> {
    try {
      const entities = await this.#prismaInstance[this.#model].deleteMany({
        where,
      })

      return entities
    } catch (err) {
      handleError(err, `adapters/PrismaAdapter.${this.#model}.deleteMany()`, true)
    }
  }

  public async find(where: Record<string, any>): Promise<T | null> {
    try {
      const entity = await this.#prismaInstance[this.#model].findUnique({
        where,
      })

      return entity
    } catch (err) {
      handleError(err, `adapters/PrismaAdapter.${this.#model}.findUnique()`, true)
    }
  }

  public async findMany(where: Record<string, any>): Promise<T[]> {
    try {
      const entities = await this.#prismaInstance[this.#model].findMany({
        where,
      })

      return entities
    } catch (err) {
      handleError(err, `adapters/PrismaAdapter.${this.#model}.findMany()`, true)
    }
  }
}
