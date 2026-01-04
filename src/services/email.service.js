'use strict';
const {randomInt} = require('crypto');
const {newOtp} = require('./otp.service');
const {getTemplates} = require('./template.service');
const { send } = require('process');
const {NotFoundError} = require('../core/error.response');   
const { replacePlaceholder } = require('../ultis');
const { template } = require('lodash');
const { link } = require('fs');


const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject='Verify your email',
    text='Please verify your email'
}) => {
    try {
        const mailOptions = {
            from:'"tip01" <linhdd85@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        }
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                return console.log(err);
            }
            console.log('Message sent: %s', info.messageId);
        });
    } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error);
        return error;
    }

}

const sendEmailToken = async ({email = null}) => {
    try {
        const token = await newOtp({email})
        const templates = await getTemplates({template_name:'HTML EMAIL TOKEN'});

        if(!templates) throw new NotFoundError('Template not found');

        const content = replacePlaceholder(template.template_html,{
            link: `http://localhost:3000/api/v1/auth/verify-email?email=${email}&token=${token.teplate_token}`,
        })

        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Vui long xac minh email cua ban',
        }).catch(err => console.log(err))

        return 1;
    } catch (error) {
        
    }
}
 
module.exports = {
    sendEmailToken
};