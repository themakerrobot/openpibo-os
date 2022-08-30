import logging

def configure_logger():
  log = logging.basicConfig(
    format = '%(asctime)s %(levelname)s %(funcName)s %(message)s',
    datefmt = '%Y-%m-%d %H:%M:%S',
    level = logging.INFO
  )
  logger = logging.getLogger(log)
  return logging
  
