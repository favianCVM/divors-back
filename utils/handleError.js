
const handleError = (err, others, res) => {
  console.warn('err: ', JSON.stringify(err));
  if (err.errorDetail) {
    console.error('errorDetail: ', JSON.stringify(err.errorDetail));
  }

  const { message, errorDetail, status } = err;

  if (res) {
    return res.status(status || 500).json({
      error: {
        message: message || 'Error al procesar su consulta, valide la información e intente de nuevo.',
        errorDetail,
      },
      ...others,
    })
  }

  return {
    status: status,
    response: {
      message: (message && typeof message !== 'object' && message !== null) ? message : 'Error al procesar su consulta, valide la información e intente de nuevo.' ,
      errorDetail: (!errorDetail && typeof message === 'object' && message !== null) ? message : errorDetail,
      type: 'error',
    }
  }
}

module.exports = handleError