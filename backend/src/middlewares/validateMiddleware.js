const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message
      }));

      return res.status(422).json({
        error: 'Dados de entrada inválidos.',
        details
      });
    }

    // Usa os dados validados e normalizados pelo schema.
    req[target] = result.data;

    return next();
  };
};

export default validate;   