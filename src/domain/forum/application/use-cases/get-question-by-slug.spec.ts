import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUsecase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionsInMemoryRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sut: GetQuestionBySlugUsecase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    questionsInMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUsecase(questionsInMemoryRepository)
  })

  it('shoud be able to find a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('titulo-de-uma-pergunta'),
    })

    await questionsInMemoryRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'titulo-de-uma-pergunta',
    })

    if (result.isRight()) {
      expect(result.value.question.id).toBeTruthy()
      expect(result.value.question.title).toEqual(newQuestion.title)
    }
  })
})
