import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
  SendNotificationUsecase,
} from '../use-cases/send-notification'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { OnQuestionCommented } from './on-question-commented'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sendNotificationUseCase: SendNotificationUsecase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>
let inMemoryQuestionCommentsRepository: InMemoryQuestionsCommentsRepository

describe('On Question Commented', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUsecase(
      inMemoryNotificationsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionsCommentsRepository()

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    new OnQuestionCommented(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('shoud send a notification when an comment question is created', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({ questionId: question.id })

    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
