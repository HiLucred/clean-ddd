import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUsecase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachements: InMemoryAnswerAttachmentsRepository

let sut: CommentOnAnswerUsecase

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachements,
    )

    sut = new CommentOnAnswerUsecase(
      inMemoryAnswersCommentsRepository,
      inMemoryAnswerRepository,
    )
  })

  it('shoud be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.id.toString(),
      content: 'Comentário adicionado a resposta.',
    })

    expect(inMemoryAnswersCommentsRepository.items[0].content).toEqual(
      'Comentário adicionado a resposta.',
    )
  })
})
