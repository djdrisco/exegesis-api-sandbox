exports.getCompanyName = function getCompanyName(context) {
    const name = context.params.query.name;
    return {message: `Hello Company: ${name}`};
}