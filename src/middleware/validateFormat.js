const validateFormat = async (body, schema) => await schema.isValid(body);

module.exports = { validateFormat };
