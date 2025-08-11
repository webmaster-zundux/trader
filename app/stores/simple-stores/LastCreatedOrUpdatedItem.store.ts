import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import type { Entity } from '../../models/Entity'

type State = {
  item?: Entity
}

export const useLastCreatedOrUpdatedItemStore = create(
  combine(
    {
      item: undefined,
    } as State,
    set => ({
      setItem: (item?: Entity): void => {
        set((): Partial<State> => ({
          item,
        }))
      },
    })
  )
)
