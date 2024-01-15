import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(id: string) {
    const notification = this.items.find(
      (notification) => notification.id.toString() === id,
    )

    if (!notification) return null

    return notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(data: Notification) {
    const itemIndex = this.items.findIndex((item) => item.id === data.id)

    this.items[itemIndex] = data
  }
}
