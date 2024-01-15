import { DeleteAnswerCommentUsecase } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUsecase

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUsecase(inMemoryAnswersCommentsRepository)
  })

  it('shoud be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswersCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswersCommentsRepository.items).toHaveLength(0)
  })

  it('shoud not be able to delete a answer comment from another user', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswersCommentsRepository.create(answerComment)

    const response = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-not-existing',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})
