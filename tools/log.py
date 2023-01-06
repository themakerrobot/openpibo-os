import logging

log_level = {"info":logging.INFO, "debug":logging.DEBUG, "warning":logging.WARNING, "error":logging.ERROR, "critical":logging.CRITICAL}
def configure_logger(level="info"):
  log = logging.basicConfig(
    format = '%(asctime)s %(levelname)s %(funcName)s %(message)s',
    datefmt = '%Y-%m-%d %H:%M:%S',
    level = log_level[level]
  )
  logger = logging.getLogger(log)
  return logger