'use strict';

const templateModel = require('../models/template.model');
const {htmlEmailToken} = require('../ultis/temp.html');

const newTemplate = async({    
    template_name,
    template_id=1,
    template_html
}) => {
    const newTemp = await templateModel.create({
        template_name,
        template_html: htmlEmailToken()
    });
}

const getTemplates = async({
    template_name
}) => {
    const templates = await templateModel.findOne({template_name});
    return templates;
}

module.exports = {
    newTemplate,
    getTemplates
};