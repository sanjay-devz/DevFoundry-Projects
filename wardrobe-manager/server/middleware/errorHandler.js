export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(error, req, res, next) {
  const status = error.status || (error.name === 'ValidationError' || error.name === 'CastError' || error.type === 'entity.parse.failed' ? 400 : error.code === 11000 ? 409 : error.code === 'LIMIT_FILE_SIZE' ? 413 : 500)
  const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 5 MB.' : error.name === 'CastError' ? 'Invalid record ID.' : error.type === 'entity.parse.failed' ? 'Request body must contain valid JSON.' : error.code === 11000 ? 'A record with those details already exists.' : error.message
  if (status >= 500) console.error(error)
  res.status(status).json({ success: false, message: status >= 500 ? 'Something went wrong.' : message })
}
