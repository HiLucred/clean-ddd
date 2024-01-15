import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchAnswersUsecase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchAnswersUseCaseRequest): Promise<FetchAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return right({ answers })
  }
}
