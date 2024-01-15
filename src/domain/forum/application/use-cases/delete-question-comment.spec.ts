import { DeleteQuestionCommentUsecase } from './delete-question-comment'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: DeleteQuestionCommentUsecase

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    sut = new DeleteQuestionCommentUsecase(inMemoryQuestionsCommentsRepository)
  })

  it('shoud be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionsCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionsCommentsRepository.items).toHaveLength(0)
  })

  it('shoud not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionsCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-not-existing',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
