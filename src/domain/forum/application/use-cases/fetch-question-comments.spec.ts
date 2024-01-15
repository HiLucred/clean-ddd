import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Questions Comments Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    )
    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    )
    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'question-id',
    })

    expect(result.value?.questionsComments).toHaveLength(3)
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-01') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-01',
    })

    expect(result.value?.questionsComments).toHaveLength(2)
  })
})
