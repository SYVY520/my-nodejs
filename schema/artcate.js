const joi = require('@hapi/joi')

const name = joi.string().required()
const teacher = joi.string().required()

exports.add_cate_schema={
    body:{
        name,
        teacher,
    }
}