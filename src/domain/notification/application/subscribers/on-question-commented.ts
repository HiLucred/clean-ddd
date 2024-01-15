import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUsecase } from '../use-cases/send-notification'
import { QuestionCommentedEvent } from '@/domain/forum/enterprise/events/question-commented-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnQuestionCommented implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUsecase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentedNotification.bind(this),
      QuestionCommentedEvent.name,
    )
  }

  private async sendQuestionCommentedNotification({
    questionComment,
  }: QuestionCommentedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário na sua pergunta em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: question.excerpt,
      })
    }
  }
}
