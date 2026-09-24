import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestOptions } from '@tanstack/react-start/server'

const handler = createStartHandler(defaultStreamHandler)

const serverEntry = Object.assign(
  (request: Request, options?: RequestOptions<Register>) =>
    handler(request, options),
  {
    fetch: (request: Request, options?: RequestOptions<Register>) =>
      handler(request, options),
  },
)

export default serverEntry
