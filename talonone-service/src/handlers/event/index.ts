import { CartReference, OrderReference } from '@commercetools/platform-sdk';
import { cartEventsHandler } from './cart-events'
import { orderEventsHandler } from './order-events'
import { Request } from 'express';
import { TalonOneUtils } from 'services/TalonOne';

enum EventType {
  CART = 1,
  CUSTOMER = 2,
  ORDER = 3,
  UNKNOWN= 0
}

interface EventHandler<T> {
  (talonOneUtils: TalonOneUtils, resource: T): void;
}

type EventResource = CartReference | OrderReference | any

type EventHandlers = {
  [K in EventType]?: EventHandler<EventResource>;
}

const eventHandlers: EventHandlers  = {
  [EventType.CART]: cartEventsHandler,
  [EventType.ORDER]: orderEventsHandler
}

export const getEventHandler = (req: Request) => {
  const { typeId: eventType } = req.body.resource as EventResource
  const type = EventType[eventType.toUpperCase() as keyof typeof EventType]
  const handler = eventHandlers[type]

  if (handler) return (resource: EventResource) => handler(req.talonOneUtils!, resource)

  return () => ({ actions: [] })
}
