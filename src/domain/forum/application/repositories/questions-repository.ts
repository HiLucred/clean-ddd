import { Question } from '../../enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyByPage({ page }: PaginationParams): Promise<Question[]>
  create(data: Question): Promise<void>
  delete(data: Question): Promise<void>
  save(data: Question): Promise<void>
}
